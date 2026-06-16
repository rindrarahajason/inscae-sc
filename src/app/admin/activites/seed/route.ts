import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

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
<p>Ce culte marque l'entrée officielle de la nouvelle promotion dans la grande famille ISC. C'est un moment solennel, empreint de joie et d'espérance, où la communauté chrétienne se retrouve pour confier l'année universitaire à Dieu. Des chants s'élèvent, des prières montent, et la présence de Dieu se fait sentir de manière tangible dans cet amphithéâtre qui résonne d'une joie collective et sincère.</p>
<p>Pour les nouveaux étudiants, c'est souvent la première fois qu'ils découvrent l'ISC. Beaucoup témoignent que c'est à ce culte qu'ils ont décidé de rejoindre la famille. Pour les anciens, c'est le renouvellement d'un engagement, le rappel de pourquoi ils ont choisi de marcher ensemble dans la foi.</p>
<h3>Au programme</h3>
<ul>
<li>🎵 Louange et adoration animées par le groupe musical ISC</li>
<li>🎤 Message d'accueil du président de l'ISC</li>
<li>📖 Prédication par un pasteur invité</li>
<li>🙏 Prière d'investiture pour les nouveaux étudiants</li>
<li>🍽️ Moment de fellowship autour d'un repas partagé</li>
</ul>
<img src="https://picsum.photos/seed/culte2/700/400" alt="Culte œcuménique INSCAE" />
<h3>Un amphithéâtre rempli de foi</h3>
<p>L'amphithéâtre de l'INSCAE se transforme en lieu de culte le temps d'une matinée. Chaises disposées en arc de cercle, sonorisation professionnelle, groupe de louange en place — tout est préparé avec soin pour que chaque participant vive un moment inoubliable.</p>
<p>L'amphithéâtre se remplit chaque année davantage, témoignant de l'impact croissant de l'ISC sur le campus. <strong>Rejoignez-nous pour ce moment unique !</strong></p>`,
  },
  {
    titre: 'Séances hebdomadaires du mercredi',
    categorie: 'Séance hebdomadaire',
    lieu: 'Salle ISC, INSCAE',
    date_debut: '2025-10-08',
    statut: 'en_cours',
    image_url: 'https://picsum.photos/seed/seance/800/500',
    description: `<h2>Chaque mercredi à 14h30 — Le rendez-vous incontournable</h2>
<p>Les séances hebdomadaires du mercredi sont le cœur battant de l'ISC. Chaque semaine, à <strong>14h30 précises</strong>, les membres se retrouvent pour un temps de partage, d'étude biblique, de débat ou d'activité thématique. C'est LE rendez-vous de la semaine, celui qu'on ne rate pas, celui dont on parle encore le lendemain.</p>
<p>Ces séances sont animées par des membres de l'ISC à tour de rôle, et parfois par des invités extérieurs — pasteurs, anciens membres, professionnels chrétiens — qui viennent partager leur expérience et leur foi. Chaque séance est une surprise, chaque séance apporte quelque chose de nouveau.</p>
<img src="https://picsum.photos/seed/seance2/700/400" alt="Séance mercredi ISC" />
<h3>La séance Saint-Valentin — La plus mémorable</h3>
<p>Parmi toutes les séances, une se distingue particulièrement dans les mémoires : <strong>la séance Saint-Valentin</strong>, animée par <em>Camille Rafalimanana</em>. Une séance qui a marqué les esprits, où l'amour selon la Bible a été exploré avec une profondeur, une créativité et une authenticité qui ont touché le cœur de tous les participants. Les rires, les réflexions, les moments de silence — tout était au rendez-vous. On en parle encore !</p>
<h3>Quelques autres séances mémorables</h3>
<ul>
<li>📖 Les séances d'étude de l'Épître aux Philippiens — semaine après semaine, un voyage dans la joie paulinienne</li>
<li>🎭 Les séances créatives : théâtre chrétien, quiz biblique, chant choral</li>
<li>💼 Les séances "Foi et Carrière" avec des professionnels chrétiens de haut niveau</li>
<li>🌍 Les séances de prière pour Madagascar et les nations</li>
<li>🎤 Les séances témoignages où des membres partagent leur parcours de foi</li>
</ul>
<img src="https://picsum.photos/seed/seance3/700/400" alt="Séance ISC mercredi" />
<h3>Comment se déroule une séance ?</h3>
<p>La séance dure en général 1h30 à 2h. Elle commence par un temps de louange, suivi de la séance proprement dite (exposé, débat, activité), et se termine par un temps de prière et d'annonces. L'ambiance est chaleureuse, détendue, fraternelle. On vient en famille.</p>
<p>Que vous soyez étudiant en première année ou en master, ces séances sont ouvertes à tous. <strong>Venez comme vous êtes !</strong></p>`,
  },
  {
    titre: 'Sorties de fin de session',
    categorie: 'Sortie de fin de session',
    lieu: 'Destinations variées autour d\'Antananarivo',
    date_debut: '2025-06-15',
    statut: 'termine',
    image_url: 'https://picsum.photos/seed/sortie/800/500',
    description: `<h2>Deux fois par an — La fête après les examens !</h2>
<p>Après les épreuves intenses des sessions d'examens, l'ISC organise ses fameuses <strong>sorties de fin de session</strong> — deux fois par an, en juin et en novembre. Un moment de détente, de rire, de jeux et de communion fraternelle bien mérité après des semaines de révisions intensives !</p>
<p>Ces sorties sont l'occasion de resserrer les liens entre membres de toutes les promotions, de célébrer ensemble la fin d'une période difficile, et de se ressourcer avant la reprise. On laisse les livres à la maison, on prend son enthousiasme, et on part à l'aventure ensemble.</p>
<img src="https://picsum.photos/seed/sortie2/700/400" alt="Sortie ISC fin de session" />
<h3>Destinations favorites</h3>
<ul>
<li>🏞️ Les rives de l'Ikopa pour une journée pique-nique avec baignade</li>
<li>🌿 Les collines d'Ambohimanga pour une promenade historique et spirituelle</li>
<li>🏊 Les piscines et centres de loisirs d'Antananarivo pour se défouler</li>
<li>⛺ Les campings aux alentours de la capitale pour une nuit sous les étoiles</li>
<li>🌄 Les hauts plateaux malgaches pour des panoramas à couper le souffle</li>
</ul>
<h3>Au programme des sorties</h3>
<ul>
<li>🏆 Jeux en équipe et tournois sportifs (football, volleyball, jeux de piste)</li>
<li>🎵 Temps de louange en plein air sous le ciel malgache</li>
<li>🍱 Repas partagé (chacun apporte quelque chose — la solidarité ISC en action !)</li>
<li>💬 Témoignages et partage de la session écoulée</li>
<li>📸 Séances photos et souvenirs immortalisés</li>
</ul>
<img src="https://picsum.photos/seed/sortie3/700/400" alt="Sortie nature ISC" />
<p><strong>Inscription requise</strong> — Les places sont limitées. Surveillez les annonces sur la plateforme ! Les sorties sont subventionnées par le bureau pour rester accessibles à tous.</p>`,
  },
  {
    titre: 'Retrouvailles ISC — Grande réunion de famille',
    categorie: 'Retrouvailles ISC',
    lieu: 'Lieu à confirmer — Antananarivo',
    date_debut: '2025-08-10',
    statut: 'a_venir',
    image_url: 'https://picsum.photos/seed/retro/800/500',
    description: `<h2>Juillet / Août — Quand toute la famille ISC se retrouve</h2>
<p>Les <strong>Retrouvailles ISC</strong> sont L'événement de l'année — le moment sacré où toute la famille ISC, étudiants actuels et anciens membres confondus, se retrouve pour une grande fête de communion fraternelle. C'est le Noël de l'ISC. C'est le moment où les années s'effacent et où la famille se retrouve comme si le temps n'avait pas passé.</p>
<p>Organisées chaque année en juillet ou en août, ces retrouvailles rassemblent des membres de toutes les générations, depuis les fondateurs de 1999 jusqu'aux étudiants de la dernière promotion. Anciens membres établis dans leur carrière, jeunes diplômés fraîchement sortis, étudiants encore sur les bancs — tous réunis par ce lien unique qui s'appelle l'ISC.</p>
<img src="https://picsum.photos/seed/retro2/700/400" alt="Retrouvailles ISC" />
<h3>Pourquoi les Retrouvailles ISC sont uniques</h3>
<ul>
<li>👨‍👩‍👧‍👦 Plusieurs générations de membres réunies en un seul endroit</li>
<li>🎤 Témoignages d'anciens membres sur leur parcours professionnel et spirituel</li>
<li>🎵 Concert de louange avec des artistes chrétiens malgaches</li>
<li>🍽️ Grand repas communautaire — chacun apporte un plat traditionnel</li>
<li>📸 Séance photo officielle de la famille ISC — un classique !</li>
<li>🏅 Remise de prix aux membres les plus engagés de l'année</li>
</ul>
<img src="https://picsum.photos/seed/retro3/700/400" alt="Famille ISC retrouvailles" />
<h3>Un moment qui dépasse les frontières</h3>
<p>Des membres de l'ISC qui vivent aujourd'hui en France, au Canada, aux États-Unis, en Afrique du Sud font parfois le voyage spécialement pour les Retrouvailles. Ou participent en visioconférence depuis leur salon. Parce que l'ISC, ce n'est pas juste une association étudiante — c'est une famille pour la vie.</p>
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
<p>La <strong>Veillée de prière</strong> de l'ISC est un moment solennel et puissant, organisé chaque année au mois d'avril. Pendant plusieurs heures — parfois toute la nuit — les membres se réunissent pour intercéder, adorer et chercher ensemble la face de Dieu. Ce n'est pas un événement ordinaire. C'est une rencontre avec le Seigneur.</p>
<p>Cet événement est l'un des plus attendus de l'année. Il marque souvent des tournants spirituels importants dans la vie des membres qui y participent. Des décisions de vie sont prises dans ces heures de prière. Des guérisons surviennent. Des vocations naissent. La veillée de l'ISC est un rendez-vous avec le ciel.</p>
<img src="https://picsum.photos/seed/veillee2/700/400" alt="Veillée de prière ISC" />
<h3>Le déroulement d'une veillée</h3>
<ul>
<li>🕯️ Ouverture par un temps de recueillement et de louange — entrer dans la présence de Dieu</li>
<li>📖 Lecture et méditation de la Parole — laisser l'Esprit parler</li>
<li>🙏 Prière en groupes sur des thématiques spécifiques : la nation malgache, les étudiants, les familles, les vocations, le réveil</li>
<li>🎵 Adoration continue avec le groupe de louange ISC — des heures de pure adoration</li>
<li>💔 Temps de repentance et de réconciliation</li>
<li>🌅 Clôture au lever du soleil avec un temps de communion et de petit-déjeuner partagé</li>
</ul>
<img src="https://picsum.photos/seed/veillee3/700/400" alt="Prière nuit ISC" />
<h3>Ce que les participants vivent</h3>
<p>Ceux qui ont participé à une veillée ISC témoignent unanimement : "On n'est plus les mêmes après." La prière collective, dans la nuit, crée une intimité avec Dieu et avec les frères et sœurs qu'aucun autre moment ne peut reproduire. La fatigue disparaît, la paix s'installe, et le matin arrive avec une lumière différente.</p>
<p>La veillée est ouverte à tous — membres ISC, amis, familles. <strong>Venez avec un cœur ouvert.</strong></p>`,
  },
  {
    titre: 'Camp d\'évangélisation',
    categorie: 'Camp évangélisation',
    lieu: 'En dehors d\'Antananarivo — région à confirmer',
    date_debut: '2025-12-20',
    statut: 'a_venir',
    image_url: 'https://picsum.photos/seed/camp/800/500',
    description: `<h2>Décembre — Aller à la rencontre des autres</h2>
<p>Chaque mois de décembre, l'ISC envoie une équipe de membres volontaires en <strong>camp d'évangélisation</strong> dans une région de Madagascar. C'est l'expression concrète de la troisième valeur de l'ISC : le <em>Service</em>. Après une année de formation, de prière et de croissance personnelle, il est temps de donner aux autres ce qu'on a reçu.</p>
<p>Pendant plusieurs jours, les membres vivent en communauté dans une région rurale ou semi-urbaine de Madagascar. Ils partagent l'Évangile, animent des activités pour les enfants et les jeunes, soutiennent les communautés chrétiennes locales et témoignent de leur foi par des actes concrets. C'est un camp qui transforme autant ceux qui partent que ceux qui les accueillent.</p>
<img src="https://picsum.photos/seed/camp2/700/400" alt="Camp évangélisation ISC" />
<h3>Ce que vivent les participants</h3>
<ul>
<li>⛺ Vie en communauté — logement simple, repas partagés, prière collective matin et soir</li>
<li>🎉 Animation d'activités : sketchs évangéliques, chants, témoignages, jeux pour enfants</li>
<li>🏘️ Visites à domicile et prière pour les familles du quartier</li>
<li>📣 Évangélisation dans les marchés, écoles et espaces publics</li>
<li>🤝 Renforcement des liens avec les Églises locales et leurs pasteurs</li>
<li>🏥 Actions sociales : distribution de vivres, soutien aux personnes vulnérables</li>
</ul>
<img src="https://picsum.photos/seed/camp3/700/400" alt="Évangélisation Madagascar ISC" />
<h3>Une expérience qui change une vie</h3>
<p>Demandez à n'importe quel ancien participant : le camp d'évangélisation est souvent décrit comme "l'une des meilleures semaines de ma vie." La simplicité de vie, la profondeur des relations, la joie de partager sa foi, la gratitude des habitants — tout cela crée des souvenirs indélébiles et une passion durable pour le service.</p>
<p><strong>Rejoignez l'équipe !</strong> Les inscriptions se font via l'espace membres dès le mois de novembre. Les places sont limitées — les premiers inscrits sont les premiers servis.</p>`,
  },
  {
    titre: 'Cellules de prière hebdomadaires',
    categorie: 'Cellule de prière',
    lieu: 'En petits groupes — domicile des membres',
    date_debut: '2025-10-06',
    statut: 'en_cours',
    image_url: 'https://picsum.photos/seed/cellule/800/500',
    description: `<h2>Chaque semaine — La prière comme fondation</h2>
<p>Les <strong>cellules de prière</strong> sont des petits groupes de 5 à 10 membres qui se retrouvent chaque semaine — généralement le lundi ou un autre soir selon les disponibilités du groupe — pour prier ensemble, étudier la Bible et se soutenir mutuellement dans la foi et dans la vie.</p>
<p>Ces cellules sont la colonne vertébrale spirituelle de l'ISC. Elles permettent à chaque membre d'être connu, soutenu et nourri dans sa foi, loin de la foule et dans la chaleur des relations profondes. Si les séances du mercredi sont la vie publique de l'ISC, les cellules en sont le cœur intime.</p>
<img src="https://picsum.photos/seed/cellule2/700/400" alt="Cellule de prière ISC" />
<h3>Comment fonctionnent les cellules</h3>
<ul>
<li>👥 Groupes de 5 à 10 membres, par affinité géographique ou par promotion</li>
<li>📅 Réunion hebdomadaire d'environ 1h30 à 2h, chez l'un des membres à tour de rôle</li>
<li>📖 Étude d'un passage biblique choisi en commun ou suivi d'un plan de lecture</li>
<li>🙏 Partage des sujets de prière personnels — on prie pour les examens, les familles, les projets</li>
<li>☕ Moment informel de fellowship autour d'un thé ou d'un café</li>
<li>📱 Suivi inter-séances via un groupe de messagerie pour se soutenir au quotidien</li>
</ul>
<img src="https://picsum.photos/seed/cellule3/700/400" alt="Petits groupes prière ISC" />
<h3>Pourquoi rejoindre une cellule ?</h3>
<p>Dans une grande communauté comme l'ISC, il est facile de se sentir anonyme. La cellule change tout cela. Dans un petit groupe, on vous connaît par votre prénom, on sait quand vous traversez une période difficile, on célèbre vos victoires. C'est la famille dans la famille.</p>
<h3>Comment rejoindre une cellule ?</h3>
<p>Pour rejoindre une cellule de prière, parlez-en à un membre du bureau lors d'une séance du mercredi, ou envoyez un message via l'espace membres. Chaque nouveau membre est encouragé à intégrer une cellule dès son arrivée à l'ISC. <strong>La prière est notre force — ensemble, elle est encore plus puissante.</strong></p>`,
  },
]

export async function GET() {
  const supabase = await createAdminClient()

  await supabase.from('activites').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  const { error } = await supabase.from('activites').insert(ACTIVITES)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  revalidatePath('/activites')
  revalidatePath('/')

  return NextResponse.json({ success: true, count: ACTIVITES.length })
}
