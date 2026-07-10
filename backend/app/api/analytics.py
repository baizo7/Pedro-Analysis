from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from app.api import deps
from app.models.user import User
from app.models.dataset import Dataset, Title

router = APIRouter()

def apply_filters(query, type: Optional[str] = None, country: Optional[str] = None, start_year: Optional[int] = None):
    if type and type != "All":
        query = query.filter(Title.type == type)
    if country and country != "All":
        query = query.filter(Title.country.ilike(f"%{country}%"))
    if start_year:
        query = query.filter(Title.release_year >= start_year)
    return query

@router.get("/kpis")
def get_kpis(
    type: Optional[str] = None,
    country: Optional[str] = None,
    start_year: Optional[int] = None,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    membership = current_user.memberships[0]
    org_id = membership.organization_id

    # Filter titles by the user's organization
    base_query = db.query(Title).join(Dataset).filter(Dataset.organization_id == org_id)
    base_query = apply_filters(base_query, type, country, start_year)

    total_titles = base_query.count()
    
    # Type breakdown
    type_counts = base_query.with_entities(Title.type, func.count(Title.id)).group_by(Title.type).all()
    type_data = [{"name": t[0] if t[0] else "Unknown", "value": t[1]} for t in type_counts]

    # Release Year trends (last 15 years available)
    year_trends = base_query.with_entities(
        Title.release_year, func.count(Title.id)
    ).filter(Title.release_year.isnot(None))\
     .group_by(Title.release_year).order_by(Title.release_year.desc()).limit(15).all()
     
    # Sort chronological for chart
    year_trends = sorted(year_trends, key=lambda x: x[0])
    year_data = [{"year": str(int(y[0])), "count": y[1]} for y in year_trends]

    # Global Markets (Distinct Countries)
    # Countries are comma separated strings, so we fetch all non-null and split in Python
    all_countries = base_query.filter(Title.country.isnot(None)).with_entities(Title.country).all()
    unique_countries = set()
    for (c_str,) in all_countries:
        for c in c_str.split(','):
            unique_countries.add(c.strip())
    global_markets = len(unique_countries)

    # Average Runtime (Movies only)
    movies = base_query.filter(Title.type == 'Movie', Title.duration.ilike('%min%')).with_entities(Title.duration).all()
    total_mins = 0
    valid_movies = 0
    for (dur,) in movies:
        try:
            total_mins += int(dur.replace(" min", "").strip())
            valid_movies += 1
        except: pass
    avg_runtime = round(total_mins / valid_movies) if valid_movies > 0 else 0

    # YoY Growth based on last two years of data
    yoy_growth = 0
    if len(year_trends) >= 2:
        last_year = year_trends[-1][1]
        prev_year = year_trends[-2][1]
        if prev_year > 0:
            yoy_growth = round(((last_year - prev_year) / prev_year) * 100, 1)

    return {
        "total_titles": total_titles,
        "type_distribution": type_data,
        "yearly_trends": year_data,
        "global_markets": global_markets,
        "avg_runtime": avg_runtime,
        "yoy_growth": yoy_growth
    }

@router.get("/genres")
def get_top_genres(
    type: Optional[str] = None,
    country: Optional[str] = None,
    start_year: Optional[int] = None,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    membership = current_user.memberships[0]
    org_id = membership.organization_id

    base_query = db.query(Title).join(Dataset).filter(Dataset.organization_id == org_id, Title.listed_in.isnot(None))
    base_query = apply_filters(base_query, type, country, start_year)
    
    # Since genres are comma separated, we fetch and aggregate in memory for MVP
    # A true enterprise solution would normalize the schema or use Postgres unnest
    titles = base_query.with_entities(Title.listed_in).all()
    genre_counts = {}
    for (genres_str,) in titles:
        if not genres_str: continue
        genres = [g.strip() for g in genres_str.split(',')]
        for g in genres:
            genre_counts[g] = genre_counts.get(g, 0) + 1
            
    # Sort and take top 10
    top_genres = sorted(genre_counts.items(), key=lambda x: x[1], reverse=True)[:10]
    result = [{"genre": g[0], "count": g[1]} for g in top_genres]
    
    return {"genres": result}

@router.get("/geography")
def get_geography(
    type: Optional[str] = None,
    start_year: Optional[int] = None,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    membership = current_user.memberships[0]
    org_id = membership.organization_id

    base_query = db.query(Title).join(Dataset).filter(Dataset.organization_id == org_id, Title.country.isnot(None))
    base_query = apply_filters(base_query, type, None, start_year)
    
    titles = base_query.with_entities(Title.country).all()
    country_counts = {}
    for (countries_str,) in titles:
        if not countries_str: continue
        # some titles have multiple countries "United States, India"
        countries = [c.strip() for c in countries_str.split(',')]
        for c in countries:
            country_counts[c] = country_counts.get(c, 0) + 1
            
    top_countries = sorted(country_counts.items(), key=lambda x: x[1], reverse=True)[:10]
    result = [{"country": c[0], "count": c[1]} for c in top_countries]
    
    return {"countries": result}

@router.get("/advanced")
def get_advanced_analytics(
    type: Optional[str] = None,
    country: Optional[str] = None,
    start_year: Optional[int] = None,
    current_user: User = Depends(deps.get_current_user),
    db: Session = Depends(deps.get_db)
):
    membership = current_user.memberships[0]
    org_id = membership.organization_id

    base_query = db.query(Title).join(Dataset).filter(Dataset.organization_id == org_id)
    base_query = apply_filters(base_query, type, country, start_year)
    
    # 1. Stacked Bar & Area (Yearly breakdown by Type & Cumulative)
    yearly_type = base_query.with_entities(
        Title.release_year, Title.type, func.count(Title.id)
    ).filter(Title.release_year.isnot(None))\
     .group_by(Title.release_year, Title.type).order_by(Title.release_year.asc()).all()
    
    yearly_dict = {}
    for year, t_type, count in yearly_type:
        y_str = str(int(year))
        if y_str not in yearly_dict:
            yearly_dict[y_str] = {"year": y_str, "Movie": 0, "TV Show": 0, "total": 0}
        yearly_dict[y_str][t_type] = count
        yearly_dict[y_str]["total"] += count
        
    sorted_years = sorted(yearly_dict.values(), key=lambda x: int(x["year"]))
    cumulative = 0
    for y_data in sorted_years:
        cumulative += y_data["total"]
        y_data["cumulative"] = cumulative

    # 2. Donut (Ratings Distribution)
    ratings = base_query.with_entities(Title.rating, func.count(Title.id))\
        .filter(Title.rating.isnot(None)).group_by(Title.rating).all()
    rating_data = [{"name": r[0], "value": r[1]} for r in ratings]

    # 3. Scatter (Duration vs Year for Movies) - Sampled for performance
    scatter_query = base_query.filter(Title.type == 'Movie', Title.duration.ilike('%min%'))\
        .with_entities(Title.release_year, Title.duration, Title.title).limit(200).all()
    
    scatter_data = []
    for y, dur, title in scatter_query:
        if not y or not dur: continue
        try:
            mins = int(dur.replace(" min", "").strip())
            scatter_data.append({"year": int(y), "duration": mins, "title": title, "z": 1})
        except: pass

    # 4. Treemap (Country Hierarchy)
    countries = base_query.filter(Title.country.isnot(None))\
        .with_entities(Title.country, Title.type, func.count(Title.id))\
        .group_by(Title.country, Title.type).all()
        
    tree_dict = {}
    for c_str, t_type, count in countries:
        # Just take primary country to keep tree clean
        c = c_str.split(",")[0].strip()
        if c not in tree_dict:
            tree_dict[c] = {"name": c, "children": []}
        tree_dict[c]["children"].append({"name": t_type, "size": count})
        
    # Top 10 countries for treemap
    tree_data = sorted(tree_dict.values(), key=lambda x: sum(c["size"] for c in x["children"]), reverse=True)[:10]

    # 5. Radar (Top 6 Genres representation)
    genres_query = base_query.filter(Title.listed_in.isnot(None)).with_entities(Title.listed_in).all()
    g_counts = {}
    for (g_str,) in genres_query:
        for g in [x.strip() for x in g_str.split(',')]:
            g_counts[g] = g_counts.get(g, 0) + 1
    top_genres = [g[0] for g in sorted(g_counts.items(), key=lambda x: x[1], reverse=True)[:6]]
    radar_data = [{"subject": g, "A": g_counts[g], "fullMark": max(g_counts.values())} for g in top_genres]

    # 6. Top Directors
    directors_query = base_query.filter(Title.director.isnot(None)).with_entities(Title.director).all()
    d_counts = {}
    for (d_str,) in directors_query:
        for d in [x.strip() for x in d_str.split(',')]:
            d_counts[d] = d_counts.get(d, 0) + 1
    top_directors = [{"name": d, "count": count} for d, count in sorted(d_counts.items(), key=lambda x: x[1], reverse=True)[:10]]

    # 7. Top Cast Members
    cast_query = base_query.filter(Title.cast_members.isnot(None)).with_entities(Title.cast_members).all()
    c_counts = {}
    for (c_str,) in cast_query:
        for c in [x.strip() for x in c_str.split(',')]:
            c_counts[c] = c_counts.get(c, 0) + 1
    top_actors = [{"name": c, "count": count} for c, count in sorted(c_counts.items(), key=lambda x: x[1], reverse=True)[:10]]

    # 8. Top Countries (Volume)
    countries_query = base_query.filter(Title.country.isnot(None)).with_entities(Title.country).all()
    ctry_counts = {}
    for (c_str,) in countries_query:
        for c in [x.strip() for x in c_str.split(',')]:
            ctry_counts[c] = ctry_counts.get(c, 0) + 1
    top_countries = [{"name": c, "count": count} for c, count in sorted(ctry_counts.items(), key=lambda x: x[1], reverse=True)[:10]]

    # 9. Quality Metrics: Runtime Distribution (Movies only)
    runtime_query = base_query.filter(Title.type == 'Movie', Title.duration.ilike('%min%')).with_entities(Title.duration).all()
    buckets = {"<60": 0, "60-70": 0, "70-80": 0, "80-90": 0, "90-100": 0, "100-110": 0, "110-120": 0, "120-130": 0, "130-140": 0, "140-150": 0, ">150": 0}
    for (dur,) in runtime_query:
        if not dur: continue
        try:
            mins = int(dur.replace(" min", "").strip())
            if mins < 60: buckets["<60"] += 1
            elif mins < 70: buckets["60-70"] += 1
            elif mins < 80: buckets["70-80"] += 1
            elif mins < 90: buckets["80-90"] += 1
            elif mins < 100: buckets["90-100"] += 1
            elif mins < 110: buckets["100-110"] += 1
            elif mins < 120: buckets["110-120"] += 1
            elif mins < 130: buckets["120-130"] += 1
            elif mins < 140: buckets["130-140"] += 1
            elif mins < 150: buckets["140-150"] += 1
            else: buckets[">150"] += 1
        except: pass
    runtime_dist = [{"bucket": k, "count": v} for k, v in buckets.items()]

    # 10. Quality Metrics: Genre Metrics (Bubble Chart: Volume vs Avg Runtime)
    genre_runtime_query = base_query.filter(Title.type == 'Movie', Title.listed_in.isnot(None), Title.duration.ilike('%min%')).with_entities(Title.listed_in, Title.duration).all()
    gm = {}
    for g_str, dur in genre_runtime_query:
        if not dur: continue
        try:
            mins = int(dur.replace(" min", "").strip())
            for g in [x.strip() for x in g_str.split(',')]:
                if g not in gm: gm[g] = {"count": 0, "total_mins": 0}
                gm[g]["count"] += 1
                gm[g]["total_mins"] += mins
        except: pass
    genre_metrics = [{"id": k, "value": v["count"], "avg_runtime": round(v["total_mins"]/v["count"])} for k, v in gm.items() if v["count"] > 10][:15]

    return {
        "time_series": sorted_years[-20:], # last 20 years
        "ratings": rating_data,
        "scatter": scatter_data,
        "treemap": [{"name": "Catalog", "children": tree_data}],
        "radar": radar_data,
        "top_directors": top_directors,
        "top_actors": top_actors,
        "top_countries": top_countries,
        "runtime_dist": runtime_dist,
        "genre_metrics": genre_metrics
    }
