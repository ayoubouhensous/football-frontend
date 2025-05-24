from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
from catboost import CatBoostRegressor
from datetime import datetime
from typing import Optional, Dict, List, Union
import uvicorn
import json
import logging

# Configuration du logging
logging.basicConfig(level=logging.INFO, 
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Initialiser l'application FastAPI
app = FastAPI(
    title="API de Prédiction de Matches de Football",
    description="API permettant de prédire les scores de matches de football",
    version="1.0.0"
)

# Configuration du middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Autorise toutes les origines en développement
    allow_credentials=True,
    allow_methods=["*"],  # Autorise toutes les méthodes
    allow_headers=["*"],  # Autorise tous les headers
)

# Définir les modèles de données pour la requête
class MatchRequest(BaseModel):
    home_team: str
    away_team: str
    match_date: str

# Définir les modèles de données pour la réponse
class MatchPrediction(BaseModel):
    home_team: str
    away_team: str
    predicted_home_goals: int
    predicted_away_goals: int
    predicted_winner: str
    match_date: str
    prediction_timestamp: str
    confidence: float = 1.0  # Ajout d'un indicateur de confiance

# Équipes de substitution pour les équipes inconnues
# Utilisez des équipes qui ont des caractéristiques similaires
DEFAULT_TEAMS = {
    "default_strong": "Barcelona",  # Équipe forte par défaut
    "default_medium": "Everton",    # Équipe moyenne par défaut
    "default_weak": "Norwich"       # Équipe faible par défaut
}

# Estimations de force des équipes (à compléter/ajuster selon vos connaissances)
TEAM_STRENGTHS = {
    # Équipes très fortes
    "Paris Saint-Germain FC": "strong",
    "Manchester City FC": "strong",
    "Real Madrid CF": "strong",
    "FC Barcelona": "strong",
    "Bayern Munich": "strong",
    "Liverpool FC": "strong",
    
    # Équipes moyennes
    "Arsenal FC": "medium",
    "Tottenham Hotspur FC": "medium",
    "Atlético Madrid": "medium",
    "Juventus": "medium",
    "Borussia Dortmund": "medium",
    
    # Équipes d'Amérique du Sud
    "Club Nacional de Football": "medium",
    "CA Peñarol": "medium",
    "Estudiantes de La Plata": "medium",
    "CSD Colo-Colo": "medium",
    "LDU de Quito": "medium",
    "Fortaleza EC": "medium",
    "EC Bahia": "medium",
    "CF Universidad de Chile": "medium",
    "Deportivo Táchira FC": "weak",
    "San Antonio Bulo Bulo": "weak"
}

# Dictionnaire de mapping des noms d'équipes
# La clé est le nom envoyé par le frontend, la valeur est le nom dans le dataset
TEAM_NAME_MAPPING = {
    # Premier League
    "Arsenal FC": "Arsenal",
    "Chelsea FC": "Chelsea",
    "Liverpool FC": "Liverpool",
    "Manchester City FC": "Man City",
    "Manchester United FC": "Man United",
    "Tottenham Hotspur FC": "Tottenham",
    "Leicester City FC": "Leicester",
    "Aston Villa FC": "Aston Villa",
    "Newcastle United FC": "Newcastle",
    "Leeds United FC": "Leeds",
    "Everton FC": "Everton",
    "Wolverhampton Wanderers FC": "Wolves",
    "West Ham United FC": "West Ham",
    "Crystal Palace FC": "Crystal Palace",
    "Brighton & Hove Albion FC": "Brighton",
    "Southampton FC": "Southampton",
    "Burnley FC": "Burnley",
    "Norwich City FC": "Norwich",
    "Watford FC": "Watford",
    "Bournemouth AFC": "Bournemouth",
    
    # La Liga
    "FC Barcelona": "Barcelona",
    "Real Madrid CF": "Real Madrid",
    "Atlético de Madrid": "Ath Madrid",
    "Sevilla FC": "Sevilla",
    "Athletic Club": "Ath Bilbao",
    "Valencia CF": "Valencia",
    "Villarreal CF": "Villarreal",
    "Real Betis Balompié": "Betis",
    "Real Sociedad de Fútbol": "Sociedad",
    "CA Osasuna": "Osasuna",
    "RC Celta de Vigo": "Celta",
    "RCD Espanyol de Barcelona": "Espanol",
    "Real Valladolid CF": "Valladolid",
    "Getafe CF": "Getafe",
    "Granada CF": "Granada",
    "Levante UD": "Levante",
    
    # Bundesliga
    "FC Bayern München": "Bayern Munich",
    "Borussia Dortmund": "Dortmund",
    "Bayer 04 Leverkusen": "Leverkusen",
    "RB Leipzig": "RB Leipzig",
    "VfL Wolfsburg": "Wolfsburg",
    "Borussia Mönchengladbach": "M'gladbach",
    "Eintracht Frankfurt": "Ein Frankfurt",
    "1. FC Union Berlin": "Union Berlin",
    "1. FC Köln": "FC Koln",
    "SC Freiburg": "Freiburg",
    "TSG 1899 Hoffenheim": "Hoffenheim",
    "VfB Stuttgart": "Stuttgart",
    "1. FSV Mainz 05": "Mainz",
    "FC Augsburg": "Augsburg",
    "Hertha BSC": "Hertha",
    "Arminia Bielefeld": "Bielefeld",
    
    # Serie A
    "Juventus FC": "Juventus",
    "FC Internazionale Milano": "Inter",
    "AC Milan": "Milan",
    "AS Roma": "Roma",
    "SSC Napoli": "Napoli",
    "SS Lazio": "Lazio",
    "ACF Fiorentina": "Fiorentina",
    "Atalanta BC": "Atalanta",
    "Torino FC": "Torino",
    "US Sassuolo Calcio": "Sassuolo",
    "Bologna FC 1909": "Bologna",
    "UC Sampdoria": "Sampdoria",
    "Udinese Calcio": "Udinese",
    "Cagliari Calcio": "Cagliari",
    "Genoa CFC": "Genoa",
    "Hellas Verona FC": "Verona",
    "Parma Calcio 1913": "Parma",
    "Spezia Calcio": "Spezia",
    "Benevento Calcio": "Benevento",
    "FC Crotone": "Crotone"
}

# Charger les modèles et le préprocesseur
@app.on_event("startup")
async def load_models():
    global cat_home, cat_away, preprocessor, matches, all_teams
    try:
        cat_home = CatBoostRegressor()
        cat_home.load_model('catboost_home_model4.cbm')

        cat_away = CatBoostRegressor()
        cat_away.load_model('catboost_away_model4.cbm')
        
        preprocessor = joblib.load('match_preprocessor4.pkl')
        matches = pd.read_csv('matchdata_preprocessed4.csv')
        matches['Date'] = pd.to_datetime(matches['Date'], errors='coerce')
        
        # Extraire la liste complète des noms d'équipes dans le dataset
        all_teams = set(matches['HomeTeam'].unique()) | set(matches['AwayTeam'].unique())
        logger.info(f"Équipes chargées: {len(all_teams)}")
        for team in all_teams:
            if not any(mapped_team == team for mapped_team in TEAM_NAME_MAPPING.values()):
                # Ajouter l'équipe au mapping avec son propre nom comme clé
                TEAM_NAME_MAPPING[team] = team        
        # Sauvegarder la liste des équipes pour référence
        with open("available_teams.json", "w", encoding="utf-8") as f:
            json.dump(sorted(list(all_teams)), f, ensure_ascii=False, indent=4)
        
    except Exception as e:
        logger.error(f"Erreur lors du chargement des modèles: {e}")
        raise HTTPException(status_code=500, detail=f"Erreur lors du chargement des modèles: {e}")

# Fonction pour déterminer une équipe similaire dans le dataset
def get_substitute_team(team_name: str) -> tuple:
    """
    Trouve une équipe de substitution pour une équipe inconnue
    en se basant sur sa force estimée.
    
    Retourne un tuple: (nom_équipe_substitut, niveau_confiance)
    """
    
    # Vérifier si nous avons une estimation de force pour cette équipe
    team_strength = TEAM_STRENGTHS.get(team_name, "medium")
    
    # Sélectionner une équipe de substitution en fonction de la force
    if team_strength == "strong":
        return DEFAULT_TEAMS["default_strong"], 0.7
    elif team_strength == "weak":
        return DEFAULT_TEAMS["default_weak"], 0.7
    else:
        return DEFAULT_TEAMS["default_medium"], 0.7

# Fonction pour normaliser les noms d'équipes
def normalize_team_name(team_name: str) -> tuple:
    """
    Convertit le nom d'équipe du format frontend au format du dataset.
    Si le nom n'est pas reconnu, trouve une équipe de substitution.
    
    Retourne un tuple: (nom_normalisé, est_substitut, niveau_confiance)
    """
    # On essaie d'abord avec le dictionnaire de mapping
    normalized_name = team_name.strip().lower()  # Convertir le nom d'équipe à minuscule

    if normalized_name in [team.lower() for team in TEAM_NAME_MAPPING.keys()]:
        # Comparaison insensible à la casse et correspondance partielle
        for frontend_name, dataset_name in TEAM_NAME_MAPPING.items():
            if frontend_name.lower() == normalized_name:
                return dataset_name, False, 1.0
    
    # Si le nom n'est pas dans le dictionnaire, essayons de faire correspondre partiellement
    for frontend_name, dataset_name in TEAM_NAME_MAPPING.items():
        if frontend_name.lower() in normalized_name or normalized_name in frontend_name.lower():
            return dataset_name, False, 0.9
    
    # Si aucune correspondance n'est trouvée, utiliser une équipe de substitution
    substitute_team, confidence = get_substitute_team(team_name)
    logger.warning(f"Équipe non reconnue: {team_name}, remplacée par {substitute_team} (confiance: {confidence})")
    return substitute_team, True, confidence

# Fonction pour générer les features
def generate_features(home_team, away_team, match_date):
    match_date = pd.to_datetime(match_date)

    def last_result(team, date, home=True):
        if home:
            prev = matches[(matches['HomeTeam'] == team) & (matches['Date'] < date)].sort_values('Date')
        else:
            prev = matches[(matches['AwayTeam'] == team) & (matches['Date'] < date)].sort_values('Date')
        if not prev.empty:
            last = prev.iloc[-1]
            if (home and last['FTR'] == 'H') or (not home and last['FTR'] == 'A'):
                return 1
            elif last['FTR'] == 'D':
                return 0
            else:
                return -1
        return 0

    def head_to_head_avg_goals(home_team, away_team, date):
        prev = matches[
            (((matches['HomeTeam'] == home_team) & (matches['AwayTeam'] == away_team)) |
             ((matches['HomeTeam'] == away_team) & (matches['AwayTeam'] == home_team))) &
            (matches['Date'] < date)
        ]
        if not prev.empty:
            return (prev['FTHG'] + prev['FTAG']).mean()
        return 0

    def rolling_form(team, date, home=True):
        if home:
            prev = matches[(matches['HomeTeam'] == team) & (matches['Date'] < date)].sort_values('Date')
            return prev['goal_difference'].rolling(3).mean().iloc[-1] if len(prev) >= 3 else 0
        else:
            prev = matches[(matches['AwayTeam'] == team) & (matches['Date'] < date)].sort_values('Date')
            return prev['goal_difference'].rolling(3).mean().iloc[-1] if len(prev) >= 3 else 0

    def avg_goals(team, date, home=True):
        if home:
            prev = matches[(matches['HomeTeam'] == team) & (matches['Date'] < date)].sort_values('Date')
            return prev['FTHG'].rolling(3).mean().iloc[-1] if len(prev) >= 3 else 0
        else:
            prev = matches[(matches['AwayTeam'] == team) & (matches['Date'] < date)].sort_values('Date')
            return prev['FTAG'].rolling(3).mean().iloc[-1] if len(prev) >= 3 else 0

    def win_rate(team, date, home=True):
        if home:
            prev = matches[(matches['HomeTeam'] == team) & (matches['Date'] < date)].sort_values('Date')
            return (prev['FTR'] == 'H').rolling(3).mean().iloc[-1] if len(prev) >= 3 else 0
        else:
            prev = matches[(matches['AwayTeam'] == team) & (matches['Date'] < date)].sort_values('Date')
            return (prev['FTR'] == 'A').rolling(3).mean().iloc[-1] if len(prev) >= 3 else 0

    def pts_avg(team, date, home=True):
        prev = matches[(matches['HomeTeam' if home else 'AwayTeam'] == team) & (matches['Date'] < date)].sort_values('Date')
        pts = prev['FTR'].map({'H': 3, 'D': 1, 'A': 0}) if home else prev['FTR'].map({'H': 0, 'D': 1, 'A': 3})
        return pts.rolling(5).mean().iloc[-1] if len(prev) >= 5 else 0

    def streak(team, date, home=True):
        prev = matches[(matches['HomeTeam' if home else 'AwayTeam'] == team) & (matches['Date'] < date)].sort_values('Date')
        results = prev['FTR'].map({'H': 1, 'D': 0, 'A': -1}) if home else prev['FTR'].map({'A': 1, 'D': 0, 'H': -1})
        streak_val = 0
        for result in results:
            if result == 1:
                streak_val += 1
            elif result == -1:
                streak_val -= 1
            else:
                streak_val = 0
        return streak_val

    features = {
        'home_team_form': rolling_form(home_team, match_date, True),
        'away_team_form': rolling_form(away_team, match_date, False),
        'home_goals_avg': avg_goals(home_team, match_date, True),
        'away_goals_avg': avg_goals(away_team, match_date, False),
        'home_win_rate': win_rate(home_team, match_date, True),
        'away_win_rate': win_rate(away_team, match_date, False),
        'is_derby': int(home_team == away_team),
        'home_last_match_result': last_result(home_team, match_date, True),
        'away_last_match_result': last_result(away_team, match_date, False),
        'head_to_head_avg_goals': head_to_head_avg_goals(home_team, away_team, match_date),
        'home_pts_avg': pts_avg(home_team, match_date, True),
        'away_pts_avg': pts_avg(away_team, match_date, False),
        'home_team_streak': streak(home_team, match_date, True),
        'away_team_streak': streak(away_team, match_date, False),
        'HomeTeam': home_team,
        'AwayTeam': away_team
    }

    return pd.DataFrame([features])

# Endpoint pour la prédiction de score
@app.post("/predict/", response_model=MatchPrediction)
async def predict_match(match_request: MatchRequest):
    try:
        # Enregistrer les données brutes pour le débogage
        logger.info(f"Requête reçue: {match_request.dict()}")
        
        # Valider la date
        try:
            match_date = pd.to_datetime(match_request.match_date)
        except ValueError:
            raise HTTPException(status_code=400, detail="Format de date invalide. Utilisez YYYY-MM-DD")
        
        # Normaliser les noms d'équipes
        home_team_normalized, home_is_substitute, home_confidence = normalize_team_name(match_request.home_team)
        away_team_normalized, away_is_substitute, away_confidence = normalize_team_name(match_request.away_team)
        
        logger.info(f"Équipe à domicile: {match_request.home_team} -> {home_team_normalized} (substitut: {home_is_substitute})")
        logger.info(f"Équipe à l'extérieur: {match_request.away_team} -> {away_team_normalized} (substitut: {away_is_substitute})")
        
        # Calculer la confiance globale dans la prédiction
        overall_confidence = min(home_confidence, away_confidence)
        if home_is_substitute and away_is_substitute:
            overall_confidence *= 0.8  # Réduire davantage la confiance si les deux équipes sont des substituts
        
        # Générer les features
        input_data = generate_features(
            home_team_normalized, 
            away_team_normalized, 
            match_request.match_date
        )
        
        # Transformer les données
        input_transformed = preprocessor.transform(input_data)
        
        # Prédire les buts
        pred_home_goals = int(round(cat_home.predict(input_transformed)[0]))
        pred_away_goals = int(round(cat_away.predict(input_transformed)[0]))
        
        # Ajuster les prédictions en fonction des forces estimées si des substituts sont utilisés
        if home_is_substitute or away_is_substitute:
            # Obtenir les forces des équipes originales
            home_strength = TEAM_STRENGTHS.get(match_request.home_team, "medium")
            away_strength = TEAM_STRENGTHS.get(match_request.away_team, "medium")
            
            # Ajuster les scores en fonction des forces relatives
            if home_strength == "strong" and away_strength == "weak":
                pred_home_goals = max(2, pred_home_goals)
                pred_away_goals = min(1, pred_away_goals)
            elif home_strength == "weak" and away_strength == "strong":
                pred_home_goals = min(1, pred_home_goals)
                pred_away_goals = max(2, pred_away_goals)
        
        # Déterminer le gagnant
        if pred_home_goals > pred_away_goals:
            winner = match_request.home_team
        elif pred_away_goals > pred_home_goals:
            winner = match_request.away_team
        else:
            winner = "Match nul"
        
        # Créer la réponse
        return MatchPrediction(
            home_team=match_request.home_team,  # Retourner les noms originaux
            away_team=match_request.away_team,  # Retourner les noms originaux
            predicted_home_goals=pred_home_goals,
            predicted_away_goals=pred_away_goals,
            predicted_winner=winner,
            match_date=match_request.match_date,
            prediction_timestamp=datetime.now().isoformat(),
            confidence=overall_confidence
        )

    except HTTPException as e:
        # Relancer les exceptions HTTP telles quelles
        raise e
    except Exception as e:
        logger.error(f"Erreur lors de la prédiction: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erreur lors de la prédiction: {str(e)}")

# Endpoint racine
@app.get("/")
async def root():
    return {
        "message": "Bienvenue sur l'API de prédiction de matches de football",
        "endpoints": {
            "/predict/": "POST - Prédire le score d'un match",
            "/health/": "GET - Vérifier l'état de l'API",
            "/teams/": "GET - Obtenir la liste des équipes disponibles",
            "/mapping/": "GET - Obtenir le mapping des noms d'équipes"
        }
    }

# Endpoint pour lister toutes les équipes disponibles
@app.get("/teams/")
async def list_teams():
    return {"teams": sorted(list(all_teams))}

# Endpoint pour obtenir le mapping des noms d'équipes
@app.get("/mapping/")
async def get_mapping():
    return {
        "team_mapping": TEAM_NAME_MAPPING,
        "team_strengths": TEAM_STRENGTHS,
        "default_teams": DEFAULT_TEAMS
    }

# Endpoint pour vérifier l'état de l'API
@app.get("/health/")
async def health_check():
    return {"status": "online", "models_loaded": "cat_home" in globals() and "cat_away" in globals()}

# Pour lancer l'application en mode standalone
if __name__ == "__main__":
    uvicorn.run("api:app", host="0.0.0.0", port=8888, reload=True)