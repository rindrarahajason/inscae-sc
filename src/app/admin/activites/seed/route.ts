import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

const ACTIVITES = [
  {
    titre: 'Culte œcuménique d\'ouverture',
    categorie: 'Culte œcuménique',
    lieu: 'Amphithéâtre INSCAE, Antananarivo',
    date_debut: '2025-10-01',
    statut: 'termine',
    image_url: 'https://picsum.photos/seed/culte/800/500',
    description: `<h2>Un moment de grâce pour accueillir la nouvelle promotion</h2>
<p>Chaque début d'année universitaire, l'INSCAE Section Chrétienne organise son <strong>culte œcuménique d'ouverture</strong>, un temps fort qui rassemble étudiants, anciens membres, enseignants et invités dans l'amphithéâtre de l'INSCAE.</p>
<p>Ce culte marque l'entrée officielle de la nouvelle promotion dans la grande famille ISC. C'est un moment solennel, empreint de joie et d'espérance, où la communauté chrétienne se retrouve pour confier l'année universitaire à Dieu.</p>
<h3>Au programme</h3>
<ul>
<li>Louange et adoration animées par le groupe musical ISC</li>
<li>Message d'accueil du président de l'ISC</li>
<li>Prédication par un pasteur invité</li>
<li>Prière d'investiture pour les nouveaux étudiants</li>
<li>Moment de fellowship autour d'un repas partagé</li>
</ul>
<p>L'amphithéâtre se remplit chaque année davantage, témoignant de l'impact croissant de l'ISC sur le campus. <strong>Rejoignez-nous pour ce moment unique !</strong></p>
<img src="https://picsum.photos/seed/culte2/700/400" alt="Culte œcuménique INSCAE" />`,
  },
  {
    titre: 'Séances hebdomadaires du mercredi',
    categorie: 'Séance hebdomadaire',
    lieu: 'Salle ISC, INSCAE',
    date_debut: '2025-10-08',
    statut: 'en_cours',
    image_url: 'https://picsum.photos/seed/seance/800/500',
    description: `<h2>Chaque mercredi à 14h30 — Le rendez-vous incontournable</h2>
<p>Les séances hebdomadaires du mercredi sont le cœur battant de l'ISC. Chaque semaine, à <strong>14h30 précises</strong>, les membres se retrouvent pour un temps de partage, d'étude biblique, de débat ou d'activité thématique.</p>
<p>Ces séances sont animées par des membres de l'ISC à tour de rôle, et parfois par des invités extérieurs — pasteurs, anciens membres, professionnels chrétiens — qui viennent partager leur expérience et leur foi.</p>
<h3>Quelques séances mémorables</h3>
<ul>
<li>🌹 <strong>La séance Saint-Valentin</strong> animée par <em>Camille Rafalimanana</em> — un moment inoubliable sur l'amour selon la Bible, particulièrement plébiscité par tous les membres</li>
<li>📖 Les séances d'étude de l'Épître aux Philippiens</li>
<li>🎭 Les séances créatives : théâtre chrétien, quiz biblique, chant choral</li>
<li>💼 Les séances "Foi et Carrière" avec des professionnels chrétiens</li>
</ul>
<p>Que vous soyez étudiant en première année ou en master, ces séances sont ouvertes à tous. <strong>Venez comme vous êtes !</strong></p>
<img src="https://picsum.photos/seed/seance2/700/400" alt="Séance mercredi ISC" />
<p>Les thèmes sont annoncés à l'avance sur notre espace membres. Rejoignez le groupe pour ne rien manquer.</p>`,
  },
  {
    titre: 'Sorties de fin de session',
    categorie: 'Sortie de fin de session',
    lieu: 'Destinations variées autour d\'Antananarivo',
    date_debut: '2025-06-15',
    statut: 'termine',
    image_url: 'https://picsum.photos/seed/sortie/800/500',
    description: `<h2>Deux fois par an — La fête après les examens !</h2>
<p>Après les épreuves intenses des sessions d'examens, l'ISC organise ses fameuses <strong>sorties de fin de session</strong> — deux fois par an, en juin et en novembre. Un moment de détente, de rire et de communion fraternelle bien mérité !</p>
<p>Ces sorties sont l'occasion de resserrer les liens entre membres de toutes les promotions, de célébrer ensemble la fin d'une période difficile, et de se ressourcer avant la reprise.</p>
<h3>Destinations favorites</h3>
<ul>
<li>🏞️ Les rives de l'Ikopa pour une journée pique-nique</li>
<li>🌿 Les collines d'Ambohimanga pour une promenade historique</li>
<li>🏊 Les piscines et centres de loisirs d'Antananarivo</li>
<li>⛺ Les campings aux alentours de la capitale</li>
</ul>
<h3>Au programme des sorties</h3>
<ul>
<li>Jeux en équipe et activités sportives</li>
<li>Temps de louange en plein air</li>
<li>Repas partagé (chacun apporte quelque chose !)</li>
<li>Témoignages et partage de la session écoulée</li>
</ul>
<img src="https://picsum.photos/seed/sortie2/700/400" alt="Sortie ISC fin de session" />
<p><strong>Inscription requise</strong> — Les places sont limitées. Surveillez les annonces sur la plateforme !</p>`,
  },
  {
    titre: 'Retrouvailles ISC — Grande réunion de famille',
    categorie: 'Retrouvailles ISC',
    lieu: 'Lieu à confirmer',
    date_debut: '2025-08-10',
    statut: 'a_venir',
    image_url: 'https://picsum.photos/seed/retro/800/500',
    description: `<h2>Juillet / Août — Quand toute la famille ISC se retrouve</h2>
<p>Les <strong>Retrouvailles ISC</strong> sont l'événement de l'année — le moment où toute la famille ISC, étudiants actuels et anciens membres confondus, se retrouve pour une grande fête de communion fraternelle.</p>
<p>Organisées chaque année en juillet ou en août, ces retrouvailles rassemblent des membres de toutes les générations, depuis les fondateurs de 1999 jusqu'aux étudiants de la dernière promotion. C'est un moment émouvant, riche en souvenirs partagés et en nouvelles rencontres.</p>
<h3>Pourquoi les Retrouvailles ISC sont uniques</h3>
<ul>
<li>👨‍👩‍👧‍👦 Plusieurs générations de membres réunies en un seul endroit</li>
<li>🎤 Témoignages d'anciens membres sur leur parcours professionnel et spirituel</li>
<li>🎵 Concert de louange avec des artistes chrétiens malgaches</li>
<li>🍽️ Grand repas communautaire</li>
<li>📸 Séance photo officielle de la famille ISC</li>
</ul>
<img src="https://picsum.photos/seed/retro2/700/400" alt="Retrouvailles ISC" />
<p>Si vous êtes un ancien membre de l'ISC, où que vous soyez dans le monde, <strong>les Retrouvailles sont pour vous</strong>. Rejoignez l'espace membres pour rester informé du lieu et de la date exacte.</p>`,
  },
  {
    titre: 'Veillée de prière',
    categorie: 'Veillée de prière',
    lieu: 'INSCAE ou église partenaire',
    date_debut: '2026-04-03',
    statut: 'a_venir',
    image_url: 'https://picsum.photos/seed/veillee/800/500',
    description: `<h2>Avril — Une nuit pour chercher la face de Dieu</h2>
<p>La <strong>Veillée de prière</strong> de l'ISC est un moment solennel et puissant, organisé chaque année au mois d'avril. Pendant plusieurs heures — parfois toute la nuit — les membres se réunissent pour intercéder, adorer et chercher ensemble la face de Dieu.</p>
<p>Cet événement est l'un des plus attendus de l'année. Il marque souvent des tournants spirituels importants dans la vie des membres qui y participent.</p>
<h3>Le déroulement d'une veillée</h3>
<ul>
<li>🕯️ Ouverture par un temps de recueillement et de louange</li>
<li>📖 Lecture et méditation de la Parole</li>
<li>🙏 Prière en groupes sur des thématiques spécifiques : la nation malgache, les étudiants, les familles, les vocations</li>
<li>🎵 Adoration continue avec le groupe de louange ISC</li>
<li>🌅 Clôture au lever du soleil avec un temps de communion</li>
</ul>
<img src="https://picsum.photos/seed/veillee2/700/400" alt="Veillée de prière ISC" />
<p>La veillée est ouverte à tous — membres ISC, amis, familles. <strong>Venez avec un cœur ouvert.</strong></p>`,
  },
  {
    titre: 'Camp d\'évangélisation',
    categorie: 'Camp évangélisation',
    lieu: 'En dehors d\'Antananarivo',
    date_debut: '2025-12-20',
    statut: 'a_venir',
    image_url: 'https://picsum.photos/seed/camp/800/500',
    description: `<h2>Décembre — Aller à la rencontre des autres</h2>
<p>Chaque mois de décembre, l'ISC envoie une équipe de membres volontaires en <strong>camp d'évangélisation</strong> dans une région de Madagascar. C'est l'expression concrète de la troisième valeur de l'ISC : le <em>Service</em>.</p>
<p>Pendant plusieurs jours, les membres vivent en communauté, partagent l'Évangile, animent des activités pour les enfants et les jeunes, et renforcent les communautés chrétiennes locales.</p>
<h3>Ce que vivent les participants</h3>
<ul>
<li>⛺ Vie en communauté — logement simple, repas partagés, prière collective</li>
<li>🎉 Animation d'activités : sketchs, chants, témoignages, jeux</li>
<li>🏘️ Visites à domicile et prière pour les familles</li>
<li>📣 Évangélisation dans les marchés, écoles et espaces publics</li>
<li>🤝 Renforcement des liens avec les churches locales</li>
</ul>
<img src="https://picsum.photos/seed/camp2/700/400" alt="Camp évangélisation ISC" />
<p>Le camp d'évangélisation transforme ceux qui y participent autant que ceux qu'ils rencontrent. <strong>Rejoignez l'équipe !</strong> Les inscriptions se font via l'espace membres dès le mois de novembre.</p>`,
  },
  {
    titre: 'Cellules de prière hebdomadaires',
    categorie: 'Cellule de prière',
    lieu: 'En petits groupes — domicile des membres',
    date_debut: '2025-10-06',
    statut: 'en_cours',
    image_url: 'https://picsum.photos/seed/cellule/800/500',
    description: `<h2>Chaque semaine — La prière comme fondation</h2>
<p>Les <strong>cellules de prière</strong> sont des petits groupes de 5 à 10 membres qui se retrouvent chaque semaine — généralement le lundi ou un autre soir selon les groupes — pour prier ensemble, étudier la Bible et se soutenir mutuellement.</p>
<p>Ces cellules sont le fondement spirituel de l'ISC. Elles permettent à chaque membre d'être connu, soutenu et nourri dans sa foi, loin de la masse et dans la profondeur des relations.</p>
<h3>Comment fonctionnent les cellules</h3>
<ul>
<li>👥 Groupes de 5 à 10 membres, par affinité ou par quartier</li>
<li>📅 Réunion hebdomadaire d'environ 1h30</li>
<li>📖 Étude d'un passage biblique choisi en commun</li>
<li>🙏 Partage de sujets de prière personnels</li>
<li>☕ Moment informel de fellowship</li>
</ul>
<img src="https://picsum.photos/seed/cellule2/700/400" alt="Cellule de prière ISC" />
<h3>Rejoindre une cellule</h3>
<p>Pour rejoindre une cellule de prière, parlez-en à un membre du bureau ou écrivez dans l'espace membres. Chaque nouveau membre est encouragé à intégrer une cellule dès son arrivée à l'ISC. <strong>La prière est notre force.</strong></p>`,
  },
]

export async function GET() {
  const supabase = await createAdminClient()

  // Check if activities already exist
  const { data: existing } = await supabase.from('activites').select('id').limit(1)
  if (existing && existing.length > 0) {
    return NextResponse.json({ message: 'Activités déjà présentes, seed ignoré.' })
  }

  const { error } = await supabase.from('activites').insert(ACTIVITES)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, count: ACTIVITES.length })
}
