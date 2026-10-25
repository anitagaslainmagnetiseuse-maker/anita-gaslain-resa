// Anita Gaslain - Tarifs et offres speciales
// Montants en euros
export const FIN_PROMO = "2026-10-31";

export const TARIFS = [
  ["soin1", "Soin energetique - 1 seance", 55, 40],
  ["soin5", "Soins energetiques - 5 seances", 200, 140],
  ["soin9", "Soins energetiques - 9 seances", 400, 280],
  ["soin15", "Soins energetiques - 15 seances", 780, 546],
  ["fam6", "Soins - forfait famille 6 personnes", 230, null],
  ["fam9", "Soins - forfait famille 9 personnes", 350, null],
  ["fam10", "Soins - forfait famille 10 personnes", 450, null],
  ["net1", "Nettoyage energetique - 1 adulte", 80, 70],
  ["net2", "Nettoyage energetique - couple", 132, 100],
  ["net3", "Nettoyage energetique - 3 seances", 220, 154],
  ["net5", "Nettoyage energetique - 5 seances", 350, 245],
  ["net8", "Nettoyage energetique - 8 seances", 550, 385],
  ["enf1", "Nettoyage enfant - 1 seance", 45, null],
  ["enf2", "Nettoyage enfant - 2 seances", 80, null],
  ["enf3", "Nettoyage enfant - 3 seances", 120, null],
  ["enf4", "Nettoyage enfant - 4 seances", 145, null],
  ["enf5", "Nettoyage enfant - 5 seances", 185, null],
  ["enf6", "Nettoyage enfant - 6 seances", 220, null],
  ["maison1", "Nettoyage maison - 50 a 80 m2", 145, 90],
  ["maison2", "Nettoyage maison - 90 a 150 m2", 250, 170],
  ["des1", "Desenvoutement - 1 personne", 250, 180],
  ["des2", "Desenvoutement - couple", 345, 280],
  ["desf2", "Desenvoutement - couple et 2 enfants", 460, 322],
  ["desf3", "Desenvoutement - couple et 3 enfants", 500, 350],
  ["desf4", "Desenvoutement - couple et 4 enfants", 600, 420],
  ["desf6", "Desenvoutement - couple et 6 enfants", 700, 490],
  ["min4", "Accompagnement minceur - 4 semaines", 200, 140],
  ["min6", "Accompagnement minceur - 6 semaines", 350, 245],
  ["tab1", "Arret du tabac - 1 seance", 60, null],
  ["tab3", "Arret du tabac - 3 seances", 130, 91],
  ["tab6", "Arret du tabac - 6 seances", 150, 105],
  ["coach1", "Coaching personnel - 1 seance", 60, null],
  ["coach3", "Coaching personnel - 3 seances", 180, null],
  ["coach6", "Coaching personnel - 6 seances", 300, null],
  ["coach12", "Coaching personnel - 12 seances", 600, null],
  ["guid1", "Guidance - 1 domaine", 25, null],
  ["guid2", "Guidance generale", 50, null],
  ["pend1", "Pendule - 1 question", 3, null],
  ["penddate", "Pendule - datation", 5, null],
  ["pend3", "Pendule - 3 questions", 9, null],
  ["pend6", "Pendule - 6 questions", 15, null],
  ["defunt", "Contact defunt - 30 minutes", 40, null],
  ["passeur", "Passeur d'ame - 1 heure", 90, null],
  ["animal1", "Animal - detection des maux", 5, null],
  ["animal2", "Animal - soin energetique", 35, null],
  ["affectif", "Accompagnement affectif", 90, null],
  ["amour", "Accompagnement amour", 150, null],
  ["affam", "Forfait affectif et amour", 150, 105]
];

export function prixActuel(ligne, date = new Date()) {
  const jour = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
  const prixNormal = ligne[2];
  const prixPromo = ligne[3];
  return jour <= FIN_PROMO && prixPromo !== null
    ? prixPromo
    : prixNormal;
}
