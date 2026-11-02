/* palabras-bee.js · Palabras del Spelling Bee (se carga recién cuando entrás al juego)
   - PALABRAS: palabras de 4 letras o más, sin tildes y sin Ñ, que el juego acepta.
   - PANGRAMAS: palabras comunes con 7 letras distintas; de cada una sale un panal (sus 7 letras).
   Expone: PalabrasBee.palabras y PalabrasBee.pangramas (listas en minúsculas) */
(function (global) {
  'use strict';

  const PALABRAS = `
abad abadia abajo abanderado abandona abandonada abandonadas abandonado abandonados abandonan abandonando abandonar
abandonara abandonaron abandone abandonen abandones abandono abanico abarca abarcan abarcando abarcar abastecer
abastecimiento abasto abastos abatido abatidos abdomen abdominal abdominales abeja abejas aberracion aberrante abertura
aberturas abierta abiertamente abiertas abierto abiertos abismo aboga abogacia abogada abogado abogados abolicion abolir
abominable abonado abonados abonar abono abonos aborda abordado abordaje abordan abordando abordar abordaron abordo
aborigen aborigenes abortar aborto abortos abra abras abraza abrazado abrazan abrazando abrazar abrazo abrazos abre
abres abreviada abreviado abri abria abrian abriendo abriera abrieron abrigo abrigos abril abrimos abrio abrir abrira
abriran abriria abro abrumado abrumador abrumadora abrupta absolucion absoluta absolutamente absolutas absoluto
absolutos absorbe absorben absorber absorbido absorcion abstencion abstenciones abstinencia abstraccion abstracta
abstracto abstractos absuelto absurda absurdas absurdo absurdos abuela abuelas abuelo abuelos abunda abundan abundancia
abundante abundantes aburre aburren aburrida aburridas aburrido aburridos aburrimiento aburrir aburro acaba acababa
acababan acabada acabado acabados acabamos acaban acabando acabar acabara acabaran acabaria acabaron acabas acabe
acabemos acaben acabo academia academias academica academicas academico academicos acallar acampada acampar acantilado
acantilados acaricia acariciando acariciar acarrea acarrear acaso acatar acceda accede acceden acceder accedido
accediendo accedieron accedio accesibilidad accesible accesibles acceso accesorio accesorios accesos accidentado
accidental accidentalmente accidente accidentes accion accionar acciones accionista accionistas acecha acecho aceite
aceites aceituna aceitunas acelera aceleracion acelerada acelerado acelerador acelerando acelerar acelero acento acentos
acentua acepcion acepta aceptaba aceptaban aceptable aceptables aceptacion aceptada aceptadas aceptado aceptados
aceptamos aceptan aceptando aceptar aceptara aceptaran aceptaria aceptaron aceptas acepte acepten aceptes acepto acera
aceras acerca acercaba acercaban acercado acercamiento acercamos acercan acercando acercar acercaron acercas acerco
acero acerque acerquen acerques acertada acertadas acertado acertar acervo acetato acida acidez acido acidos acierta
acierto aciertos aclamado aclara aclaracion aclaraciones aclarado aclaran aclarando aclarar aclare aclaro acne acoge
acogedor acoger acogida acogido acogio acometer acomoda acomodada acomodado acomodados acomodar acomodo acondicionado
aconseja aconsejable aconsejado aconsejan aconsejar aconsejo acontece acontecido acontecimiento acontecimientos
acontecio acopio acoplamiento acordaba acordada acordado acordamos acordando acordar acordaron acorde acordeon acordes
acordo acortar acosa acosado acosador acosando acosar acoso acosta acostada acostado acostar acoste acostumbra
acostumbraba acostumbrada acostumbrado acostumbrados acostumbran acostumbrando acostumbrar acostumbras acostumbre
acostumbro acre acredita acreditacion acreditada acreditado acreditados acreditar acredite acreedor acreedores acres
acronimo acta actas actitud actitudes activa activacion activada activado activados activamente activan activando
activar activas active actividad actividades activismo activista activistas activo activos acto actor actores actos
actrices actriz actua actuaba actuaban actuacion actuaciones actuado actual actuales actualidad actualiza actualizacion
actualizaciones actualizada actualizadas actualizado actualizados actualizan actualizando actualizar actualizo
actualmente actuamos actuan actuando actuar actuara actuaron actue actuen actuo acuarela acuario acuatica acuaticas
acuatico acuaticos acuda acudan acude acuden acudian acudido acudiendo acudieron acudio acudir acueducto acuerda
acuerdan acuerdas acuerde acuerden acuerdo acuerdos acuesta acuesto acumula acumulacion acumulada acumuladas acumulado
acumulados acumulan acumulando acumular acumulo acusa acusaba acusacion acusaciones acusada acusadas acusado acusados
acusan acusando acusar acusaron acuse acuso acustica acustico adan adapta adaptacion adaptaciones adaptada adaptadas
adaptado adaptador adaptados adaptan adaptando adaptar adecuacion adecuada adecuadas adecuado adecuados adecuar adelanta
adelantada adelantado adelantados adelantan adelantando adelantar adelante adelanto adelantos adelgazar ademas
adentrarse adentro adeptos adherencia adherentes adherido adhesion adhiere adhieren adiccion adicciones adicion
adicional adicionales adiciones adicta adictivo adicto adictos adiestramiento adios aditivos adivina adivinar adivinen
adivino adjetivo adjetivos adjudica adjudicacion adjudicado adjudico adjunta adjunto adjuntos administra administracion
administrada administrado administrador administradora administradores administrados administran administrando
administrar administrativa administrativas administrativo administrativos admira admiraba admirable admiracion admirado
admirador admiradores admiran admirar admiro admisible admision admita admite admiten admitida admitido admitidos
admitiendo admitio admitir admito adobe adoctrinamiento adolescencia adolescente adolescentes adonde adopcion adopta
adoptada adoptadas adoptado adoptados adoptan adoptando adoptar adoptaron adopte adopten adoptiva adoptivo adoptivos
adopto adora adoraba adorable adorables adoracion adorada adorado adoran adorar adornada adornado adornar adorno adornos
adoro adquiera adquieran adquiere adquieren adquirida adquiridas adquirido adquiridos adquiriendo adquirieron adquirio
adquirir adquisicion adquisiciones adquisitivo adrede adrenalina adrian adscrito adscritos aduana aduanas aduanera
aduanero aduaneros aduciendo adulta adultas adulterio adulto adultos advenimiento adversa adversario adversarios
adversas adversidad adversidades adverso adversos advertencia advertencias advertia advertido advertir advierte
advierten advierto advirtiendo advirtieron advirtio adyacente adyacentes aerea aereas aereo aereos aerodromo aerolinea
aerolineas aeronautica aeronave aeronaves aeropuerto aeropuertos aerosol afan afeccion afecciones afecta afectaba
afectacion afectada afectadas afectado afectados afectan afectando afectar afectara afectaria afectaron afecte afecten
afectiva afectivo afecto afectos afectuoso afeitado afeitar aferra afgano afianzar afiche afiches aficion aficionada
aficionado aficionados aficiones afilada afilado afiliacion afiliada afiliadas afiliado afiliados afin afines afinidad
afirma afirmaba afirmaban afirmacion afirmaciones afirmado afirman afirmando afirmar afirmaron afirmativa afirmativo
afirmo afliccion afloja aflojar afluencia afluente afluentes aforo afortunada afortunadamente afortunado afortunados
afrenta africana africanas africano africanos afro afroamericano afroamericanos afronta afrontar afuera afueras agallas
agarra agarrado agarran agarrando agarrar agarraron agarras agarre agarren agarres agarro agencia agencias agenda
agendas agente agentes agil agiles agilidad agilizar agita agitacion agitada agitado agitando agitar agonia agora agosto
agota agotada agotadas agotado agotador agotados agotamiento agotan agotando agotar agotaron agoto agrada agradable
agradables agradan agradar agrade agradece agradecemos agradecen agradecer agradeceria agradecida agradecido agradecidos
agradeciendo agradecimiento agradecimientos agradecio agradezco agrado agrandar agraria agrarias agrario agrarios agrava
agravada agravado agravante agravio agravios agredido agredir agrega agregacion agregada agregado agregados agregamos
agregan agregando agregar agregaron agrego agregue agreguen agresion agresiones agresiva agresivas agresividad agresivo
agresivos agresor agresores agricola agricolas agricultor agricultores agricultura agridulce agro agroindustria
agronomia agronomo agropecuaria agropecuarias agropecuario agropecuarios agrupa agrupacion agrupaciones agrupadas
agrupados agrupan agrupar agua aguacate aguacero aguada aguado aguanta aguantado aguantan aguantando aguantar aguantas
aguante aguanten aguanto aguarda aguardiente aguas aguayo aguda agudas agudeza agudo agudos aguero aguila aguilas
aguinaldo aguja agujas agujero agujeros agustin agustina ahoga ahogada ahogado ahogados ahogando ahogar ahogo ahondar
ahorcado ahorita ahorra ahorrado ahorran ahorrando ahorrar ahorro ahorros ahumada ahumado aire aires aislada aisladas
aislado aislados aislamiento aislante aislar ajedrez ajena ajenas ajeno ajenos ajusta ajustada ajustado ajustados
ajustan ajustando ajustar ajuste ajustes alaba alabado alabando alabanza alabanzas alabar alabo alado alambre alambres
alameda alamo alan alarde alarga alargada alargado alargar alarma alarmante alarmantes alarmas alas alaves alba albanes
albedrio alberca alberga albergan albergar albergue albergues albino albores albornoz alboroto album albumes alcaide
alcalde alcaldes alcaldesa alcaldia alcaldias alcance alcancen alcances alcantara alcantarilla alcantarillado
alcantarillas alcanza alcanzaba alcanzada alcanzado alcanzados alcanzamos alcanzan alcanzando alcanzar alcanzara
alcanzaria alcanzaron alcanzo alcazar alcoba alcohol alcoholica alcoholicas alcoholico alcoholicos alcoholismo aldea
aldeanos aldeas aleacion aleatoria aleatorio aleatorios alega alegaciones alegan alegando alegar alegato alegatos alego
alegoria alegra alegran alegrar alegre alegremente alegres alegria alegrias alegro aleja alejada alejadas alejado
alejados alejamiento alejan alejando alejar aleje alejo aleluya aleman alemana alemanas alemanes alentado alentador
alentando alentar alento alergia alergias alergica alergico alero alerta alertar alertas alerto aleta aletas alfa
alfabetico alfabetizacion alfabeto alferez alfombra alfombras alga algas algebra algo algodon algoritmo algoritmos
alguacil alguien alguna algunas alguno algunos aliada aliadas aliado aliados alianza alianzas alias alicante alienacion
alienigena alienigenas alienta aliento alimenta alimentacion alimentada alimentado alimentados alimentan alimentando
alimentar alimentaria alimentarias alimentario alimentarios alimenticia alimenticias alimenticio alimenticios alimento
alimentos alineacion alineado alineados alivia aliviado aliviar alivio alla allanamiento allanamientos allanar allegados
allende alli alma almacen almacena almacenada almacenado almacenados almacenaje almacenamiento almacenan almacenar
almacenes almagro almas almendra almendras almidon almirante almohada almohadas almorzar almuerzo almuerzos aloe aloja
alojado alojados alojamiento alojamientos alojar alonso alquila alquilado alquilar alquiler alquileres alquilo alquimia
alrededor alrededores alta altamente altar altares altas altavoces altavoz altera alteracion alteraciones alterada
alterado alterados alteran alterando alterar altercado alterna alternancia alternando alternas alternativa alternativas
alternativo alternativos alterno altero alteza altibajos altiplano altisimo altitud alto altos altruista altura alturas
alucinaciones alucinante alude aludido aludiendo alumbrado aluminio alumna alumnado alumnas alumno alumnos alusion
alusiones aluvion alza alzada alzado alzamiento alzan alzando alzar alzaron alzas alzheimer alzo amaba amaban amabilidad
amable amablemente amables amada amadeo amado amador amados amalgama amamos aman amando amanece amanecer amanecio amante
amantes amapola amar amara amare amarga amargado amargas amargo amargos amargura amarilla amarillas amarillento amarillo
amarillos amarrado amas amazonas amazonia amazonica ambar ambas ambicion ambiciones ambiciosa ambicioso ambiciosos
ambientacion ambientada ambiental ambientales ambiente ambientes ambigua ambiguedad ambiguo ambito ambitos ambulancia
ambulancias ambulante ambulantes amelia amen amena amenaza amenazaba amenazaban amenazada amenazadas amenazado
amenazados amenazan amenazando amenazante amenazar amenazaron amenazas amenazo ameno americana americanas americano
americanos americo amerita ames ametralladora ametralladoras amia amiga amigable amigables amigas amigo amigos
aminoacidos amir amistad amistades amistosa amistoso amistosos amnesia amnistia amoniaco amor amores amorosa amorosas
amoroso amorosos amortizacion amos ampara amparados amparo amplia ampliacion ampliaciones ampliada ampliado ampliando
ampliar amplias amplificador amplio amplios amplitud ampollas amuleto anal anales analfabeta analfabetismo analfabeto
analfabetos analgesicos analisis analista analistas analitica analitico analiza analizada analizadas analizado
analizados analizamos analizan analizando analizar analizaron analizo analoga analogia analogica analogico analogo
analogos anaranjado anarquia anarquismo anarquista anarquistas anastasia anatomia ancestral ancestrales ancestros ancha
anchas ancho anchos anchura anciana ancianas anciano ancianos ancla anclado anda andaba andaban andado andadura
andaluces andaluz andaluza andaluzas andamos andan andando andante andar andas ande anden andina andinas andino andinos
ando andorra androide anduve anduvo anecdota anecdotas anemia anestesia anexion anexo anexos anfiteatro anfitrion
anfitriona anfitriones angel angeles angelica angelina angelito anglo anglosajon anglosajones angosto angostura anguila
angular angulo angulos angus angustia angustias anhela anhelo anhelos anillo anillos anima animaba animacion animaciones
animada animadas animado animador animadores animados animal animales animan animando animar animas anime animes animo
animos aniquilacion aniquilar anis aniversario anoche anochecer anomalia anomalias anonima anonimas anonimato anonimo
anonimos anorexia anormal anormales anos anota anotacion anotaciones anotado anotados anotando anotar anote anoto ansia
ansias ansiedad ansiosa ansioso ansiosos antartica ante anteayer antebrazo antecedente antecedentes antecesor
antecesores antelacion antemano antena antenas anteojos antepasado antepasados anteproyecto anterior anteriores
anterioridad anteriormente antesala anti antibiotico antibioticos anticipa anticipacion anticipada anticipadas
anticipado anticipar anticipo anticonceptivos anticorrupcion anticristo anticuada anticuado anticuerpos antidepresivos
antidisturbios antidoto antifascista antigua antiguamente antiguas antiguedad antiguedades antiguo antiguos antisemita
antisemitismo antisocial antiterrorista antivirus antoja antojo antologia antorcha antorchas antro antropologia
antropologo antropologos anual anuales anualmente anuario anula anulacion anulada anulado anular anulo anuncia anunciaba
anunciada anunciadas anunciado anunciados anunciamos anuncian anunciando anunciantes anunciar anunciara anunciaron
anuncie anuncio anuncios anzuelo apache apacible apaciguar apaga apagada apagadas apagado apagan apagando apagar
apagaron apago apagon apagones apague aparato aparatos aparcamiento aparcar aparece aparecen aparecer aparecera
apareceran apareceria apareces aparecia aparecian aparecido apareciendo apareciera aparecieron aparecio aparenta
aparentar aparente aparentemente aparentes aparezca aparezcan aparicion apariciones apariencia apariencias aparta
apartada apartado apartados apartamento apartamentos apartar aparte apartheid aparto apasiona apasionada apasionadamente
apasionado apasionados apasionante apatia apego apela apelacion apelaciones apelando apelar apellido apellidos apelo
apenas apendice aperitivo apertura aperturas apesta apetece apetito apice apio aplastado aplastante aplastar aplaude
aplauden aplaudido aplaudiendo aplaudir aplaudo aplauso aplausos aplazamiento aplazar aplica aplicaba aplicable
aplicables aplicacion aplicaciones aplicada aplicadas aplicado aplicados aplicamos aplican aplicando aplicar aplicara
aplicaran aplicaron aplico aplique apliquen apodado apodera apoderado apoderados apoderaron apodero apodo apodos apogeo
apologia aporta aportacion aportaciones aportado aportados aportan aportando aportar aportaron aporte aporten aportes
aporto aposentos apostado apostamos apostando apostar aposto apostol apostoles apostolica apostolico apoya apoyaba
apoyaban apoyada apoyadas apoyado apoyados apoyamos apoyan apoyando apoyar apoyara apoyaria apoyaron apoyas apoye apoyen
apoyo apoyos aprecia apreciacion apreciada apreciado apreciados apreciamos aprecian apreciar aprecio aprehension aprenda
aprendamos aprendan aprendas aprende aprendemos aprenden aprender aprendera aprenderan aprenderas aprendes aprendi
aprendices aprendida aprendido aprendiendo aprendieron aprendimos aprendio aprendiste aprendiz aprendizaje aprendizajes
aprendo apresado apresurado apresuro apretada apretado apretados apretando apretar apreto apreton aprieta aprieto
aprobacion aprobada aprobadas aprobado aprobados aprobando aprobar aprobaron aprobo apropiacion apropiada apropiadamente
apropiadas apropiado apropiados aprovecha aprovechada aprovechado aprovechamiento aprovechamos aprovechan aprovechando
aprovechar aprovecharon aproveche aprovechen aprovecho aproxima aproximacion aproximaciones aproximada aproximadamente
aproximado aproximan aprueba aprueban apruebe aprueben apruebo apta aptas aptitud aptitudes apto aptos apuesta apuestan
apuestas apuesto apunta apuntaba apuntado apuntan apuntando apuntar apuntaron apuntas apunte apuntes apunto apurado
apurar apure apuro apuros aquella aquellas aquello aquellos aqui arabe arabes arabia arado aragones aragonesa aragoneses
arana arancel aranceles arandanos aras arbitraje arbitral arbitraria arbitrariamente arbitrarias arbitrariedad
arbitrario arbitro arbitros arbol arboleda arboles arbusto arbustos arca arcadas arcade arcaica arcaico arcangel arcas
arce archiduque archipielago archivado archive archivo archivos arcilla arco arcos arde arden arder ardiendo ardiente
ardientes ardilla ardillas ardor ardua arduo area areas arena arenal arenales arenas arepa arequipa ares argelino
argentina argentinas argentino argentinos argento argumenta argumentacion argumentado argumental argumentan argumentando
argumentar argumento argumentos aria ariana arias arido aries arista aristas aristocracia aritmetica arma armada armadas
armado armados armadura armaduras armamento arman armando armar armario armarios armaron armas armazon arme armenia
armenio armenios armisticio armo armonia armonica armonico aroma aromas aromaticas aros arpa arqueologia arqueologica
arqueologicas arqueologico arqueologicos arqueologo arqueologos arquero arqueros arquetipo arquidiocesis arquitecta
arquitecto arquitectonica arquitectonicas arquitectonico arquitectonicos arquitectos arquitectura arrabal arraigada
arraigado arraigo arranca arrancado arrancamos arrancan arrancando arrancar arrancaron arranco arranque arrasa arrasar
arraso arrastra arrastrada arrastrado arrastrados arrastran arrastrando arrastrar arrastre arrastro arre arrebatado
arrebatar arrebato arrechera arrecho arrecife arrecifes arregla arreglada arreglado arreglamos arreglan arreglando
arreglar arreglaron arregle arreglen arreglo arreglos arrendamiento arrepentido arrepentimiento arrepentir arrepentiras
arrepentirse arrepiente arrepiento arrestada arrestado arrestados arrestan arrestar arrestaron arresto arrestos arriba
arribaron arribo arriendo arriesga arriesgada arriesgado arriesgan arriesgando arriesgar arriesgo arroba arrogancia
arrogante arrogantes arroja arrojado arrojados arrojan arrojando arrojar arrojaron arrojo arroyo arroyos arroz arruga
arrugas arruina arruinada arruinado arruinan arruinando arruinar arruinaron arruine arruino arsenal arsenico arte
artefacto artefactos arteria arterial arterias artes artesanal artesanales artesania artesanias artesano artesanos
artico articula articulacion articulaciones articulado articular articulo articulos artifice artificial artificiales
artificialmente artigas artilleria artista artistas artistica artisticas artistico artisticos artritis arzobispado
arzobispo asada asado asador asados asalariado asalariados asaltado asaltan asaltantes asaltar asaltaron asalto asaltos
asamblea asambleas ascendencia ascendente ascender ascendia ascendido ascendiendo ascendieron ascendio ascension ascenso
ascensor ascensores ascensos asciende ascienden asco asedio asegura aseguraba asegurada asegurado aseguradora
aseguradoras asegurados aseguramos aseguran asegurando asegurar aseguraron asegure aseguren aseguro asemeja asensio
asentada asentado asentados asentamiento asentamientos aseo asequible asequibles ases asesina asesinada asesinadas
asesinado asesinados asesinan asesinando asesinar asesinaron asesinas asesinato asesinatos asesino asesinos asesor
asesora asesoramiento asesorar asesores asesoria asfalto asfixia asian asiatica asiaticas asiatico asiaticos asienta
asiente asiento asientos asigna asignacion asignaciones asignada asignadas asignado asignados asignan asignar asignaron
asignatura asignaturas asigno asilo asimilacion asimilar asimismo asique asis asista asistan asiste asisten asistencia
asistencial asistenciales asistencias asistente asistentes asisti asistia asistian asistida asistido asistiendo
asistieron asistimos asistio asistir asistira asma asno asocia asociacion asociaciones asociada asociadas asociado
asociados asocian asociar asocio asoma asombra asombrado asombro asombrosa asombrosas asombroso asombrosos asomo aspecto
aspectos aspero aspira aspiracion aspiraciones aspiran aspirante aspirantes aspirar aspirina asquerosa asqueroso
asquerosos asta asteroide asteroides astillero astilleros astral astro astrologia astronauta astronautas astronomia
astronomico astronomo astronomos astros astucia asturiana asturiano asturianos astuta astuto asuma asuman asume asumen
asumi asumida asumido asumiendo asumieron asumimos asumio asumir asumira asumo asuncion asunto asuntos asusta asustada
asustado asustados asustan asustar asuste asusto ataca atacaba atacaban atacada atacadas atacado atacados atacama atacan
atacando atacante atacantes atacar atacaron ataco atada atadas atado atados ataduras atajar atajo atajos atalaya ataque
ataquen ataques atar atardecer atascado ataud ataudes ateismo atencion atenciones atender atendera atendia atendida
atendidas atendido atendidos atendiendo atendieron atendio ateneo atenta atentado atentados atentamente atentan atentar
atento atentos atenuar ateo ateos aterra aterrador aterradora aterriza aterrizaje aterrizar aterrizo atico atienda
atiendan atiende atienden atiendo atisbo atlantica atlas atleta atletas atletica atletico atletismo atmosfera atmosferas
atmosferica atocha atomica atomicas atomico atomo atomos atormentado atraccion atracciones atraco atractiva atractivas
atractivo atractivos atrae atraen atraer atraida atraido atraidos atrajo atrapa atrapada atrapadas atrapado atrapados
atrapan atrapar atrapo atras atrasada atrasado atrasados atraso atravesaba atravesado atravesando atravesar atraveso
atraviesa atraviesan atrayendo atreva atreve atreven atreveria atreves atrevida atrevido atrevidos atrevimiento atrevio
atrevo atribucion atribuciones atribuida atribuidas atribuido atribuir atributo atributos atribuye atribuyen atribuyo
atrio atroces atrocidad atrocidades atropellado atropellar atropello atropellos atroz atuendo atun audaces audacia audaz
audicion audiciones audiencia audiencias audifonos audio audios audiovisual audiovisuales auditiva auditor auditores
auditoria auditorias auditorio auge augusta augusto aula aulas aumenta aumentaba aumentada aumentado aumentan aumentando
aumentar aumentara aumentaria aumentaron aumente aumenten aumento aumentos aunado aunque aura auricular auriculares
aurora ausencia ausencias ausente ausentes auspiciado auspicio auspicios austeridad austral australiana australiano
australianos austriaco autentica autenticas autenticidad autentico autenticos autismo autista auto autobiografia autobus
autobuses autocritica autoctona autoctonas autoctonos autodefensa autodefensas autodidacta autoestima autogestion
autografo autografos automatica automaticas automatico automaticos automatizacion automatizado automotor automotores
automotriz automovil automoviles automovilismo automovilistico autonoma autonomas autonomia autonomias autonomica
autonomicas autonomico autonomicos autonomo autonomos autopista autopistas autopsia autor autora autoras autores autoria
autoridad autoridades autoritaria autoritario autoritarios autoritarismo autoriza autorizacion autorizaciones autorizada
autorizadas autorizado autorizados autorizar autorizo autos autosuficiente autovia auxiliar auxiliares auxilio auxilios
aval avala avalado avalan avalancha avance avances avanza avanzaba avanzada avanzadas avanzado avanzados avanzamos
avanzan avanzando avanzar avanzaron avanzo avaricia avatar avatares aveces avecina avellaneda avena avenida avenidas
aventura aventuras aventurero aventureros avergonzada avergonzado averguenza averia averias averigua averiguar aversion
aves avestruz aviacion aviador aviles avion aviones avioneta avisa avisado avisan avisando avisar avisaron avisas avise
avisen aviso avisos avispa avispas axilas ayer ayuda ayudaba ayudaban ayudado ayudamos ayudan ayudando ayudante
ayudantes ayudar ayudara ayudaran ayudaremos ayudaria ayudarian ayudaron ayudas ayude ayudemos ayuden ayudes ayudo ayuno
ayuntamiento ayuntamientos azafran azar azote azotea azotes azteca aztecas azucar azucarera azucares azufre azul azulado
azulejos azules azur baba babel babilonia bacalao bache baches bachiller bachillerato bacon bacteria bacteriana
bacterias bagaje bahia baila bailaba bailamos bailan bailando bailar bailarin bailarina bailarinas bailarines bailas
baile bailes bailo baja bajaba bajada bajadas bajado bajamos bajan bajando bajar bajara bajaron bajas baje bajen bajes
bajista bajo bajon bajos bala balacera balada balance balances balanza balas balazo balazos balboa balcon balcones balde
baldosas bale balear baleares ballena ballenas ballesta ballesteros ballet balneario balnearios balon baloncesto balones
balonmano balsa balsamo balsas baluarte bambu banal banana bananas banca bancada bancar bancaria bancarias bancario
bancarios bancarrota bancas banco bancos banda bandas bandeja bandejas bandera banderas bandido bandidos bando bandos
banque banquero banqueros banqueta banquete banquetes banquillo baraja barajas baranda barata baratas barato baratos
barba barbacoa barbados barbara barbaridad barbaridades barbarie barbaro barbaros barbas barbero barbilla barbudo barca
barcenas barco barcos bardo bares barniz barometro baron barones baronesa barra barracas barragan barranca barrancas
barranco barrancos barras barre barreda barrer barrera barreras barriada barricada barricadas barrido barriga barril
barriles barrio barrios barro barroca barroco barros barroso barrotes basa basaba basada basadas basado basados basal
basan basar base bases basica basicamente basicas basico basicos basilica basilio baso basquet basquetbol basta bastaba
bastan bastante bastantes bastara bastardo bastardos bastaria bastidores bastion basto baston bastones bastos basura
basuras basurero bata batalla batallas batallon batallones bate bateria baterias baterista bates batida batido batiendo
batio batir batista batuta baul bautismo bautista bautizada bautizado bautizados bautizo bayas baza bazar bazo beato
beba bebe beben beber bebes bebia bebida bebidas bebido bebiendo bebio bebo beca becario becarios becas becerra becerro
beisbol bejarano belgas belgica belica belico belicos bella bellas belleza bellezas bellisima bello bellos bendecida
bendecido bendecir bendice bendicion bendiciones bendiga bendita bendito benefactor benefica beneficas beneficencia
beneficia beneficiado beneficiados benefician beneficiando beneficiar beneficiara beneficiario beneficiarios beneficie
beneficien beneficio beneficios beneficiosa beneficioso benefico beneplacito bengala benigno benito benjamin berenjena
berlin bermejo bermudas bernardo besa besado besan besando besar besas beso besos bestia bestial bestias beta biblia
biblica biblicas biblico biblicos bibliografia bibliograficas biblioteca bibliotecario bibliotecarios bibliotecas
bicarbonato bicentenario bicho bichos bici bicicleta bicicletas bicis bien bienal bienes bienestar bienvenida
bienvenidas bienvenido bienvenidos bigote bigotes bilateral bilaterales bilingue bilingues bilis billar billete
billetera billetes billon billones binario bingo binomio biodiversidad biografia biografias biografico biograficos
biologia biologica biologicas biologico biologicos biologo biomasa biopsia bioquimica biosfera biotecnologia
bipartidismo bipolar bisabuelo bitacora bits bizarro bizcocho bizcochos blanca blancas blanco blancos blanda blandas
blando blandos blanquear blanqueo blasfemia blindado blindados blindaje bloc bloque bloquea bloqueada bloqueadas
bloqueado bloqueados bloquean bloqueando bloquear bloquearon bloquee bloqueo bloqueos bloques blusa boba bobina bobo
bobos boca bocadillo bocadillos bocado bocas boceto bocetos bocha bochorno bochornoso bocina bocinas boda bodas bodega
bodegas body bofetada boga bohemia bohemio boicot boicotear bola bolas bolchevique bolcheviques bolero boleta boletas
boletin boletines boleto boletos boliche boligrafo bolita bolitas bolivar bolivares bolivariana bolivariano bolivarianos
boliviana boliviano bolivianos bollo bollos bolo bolos bolsa bolsas bolsillo bolsillos bolso bolson bolsos boluda
boludear boludeces bomba bombardear bombardeo bombardeos bombardero bombarderos bombas bombeo bombero bomberos bombilla
bombo bombon bombonera bombones bona bonaerense bonanza bondad bondades bondadoso bones bonificacion bonificaciones
bonilla bonita bonitas bonito bonitos bono bonos boom borda bordado bordados borde bordes bordo boreal boricua borneo
borra borracha borrachera borracho borrachos borrado borrador borradores borrados borran borrando borrar borraron borre
borrego borregos borren borro borron borrosa bosnia bosque bosques bosta bota botanica botanico botar botas bote botella
botellas botero botes botin botines boton botones boutique boveda bovedas boxeador boxeadores boxeo braga bragas brandy
brasa brasas brasilera brasilero brasileros brava bravas bravo bravos brazalete brazaletes brazo brazos brea brecha
brechas breve brevedad breves brigada brigadas brigadier brilla brillan brillando brillante brillantes brillar brillo
brinda brindado brindamos brindan brindando brindar brindaron brinde brindis brindo brisa brisas bristol britanica
britanicas britanico britanicos broche broma bromas bromea bromeando bromear bronca bronce bronceado bronco brota brote
brotes bruja brujas brujeria brujo brujos brujula brusca bruscamente brusco bruscos bruselas bruta brutal brutales
brutalidad brutalmente bruto brutos bucal bucear buceo bucle buda budismo budista budistas buen buena buenas
buenaventura bueno buenos buey bueyes bufalo bufanda bufete bufon buho buitre buitres bula bulevar bulgara bulgaro
bulgaros bulla bulto bultos buque buques burbuja burbujas burda burdel burdeos burgos burgues burguesa burgueses
burguesia burla burlan burlando burlar burlas burlo buro burocracia burocratas burocratica burocratico burocraticos
burra burrito burro burros bursatil busca buscaba buscaban buscada buscado buscador buscadores buscados buscamos buscan
buscando buscar buscara buscaran buscare buscaria buscarla buscarlas buscaron buscas busco buses busque busqueda
busquedas busquemos busquen busques busto bustos butaca butacas buzo buzon buzos cabal caballeria caballero caballeros
caballito caballo caballos cabe cabecera cabeceras cabecilla cabecillas cabellera cabello cabellos caben caber cabeza
cabezas cabezazo cabezon cabia cabida cabildo cabildos cabina cabinas cable cableado cables cabo cabos cabra cabras
cabreado cabrera cabria caca cacao caceria cacerola cache cachemira cachetada cacho cachonda cachondo cachorro cachorros
cacique caciques cactus cada cadaver cadaveres cadena cadenas cadencia cadera caderas cadete cadetes caduca caducidad
caemos caen caer caeran caeria caes cafe cafeina cafes cafetera cafeteria cafeterias caga cagada cagadas cagado cagamos
cagas cagaste caia caian caida caidas caido caidos caigan caigas caiman caiste caja cajas cajera cajero cajeros cajon
cajones cala calabaza calabazas calabozo calado calamar calamidad calatrava calavera calaveras calcetin calcetines
calcio calcula calculada calculado calculadora calculan calculando calcular calculo calculos caldas caldera calderas
calderon caldo calefaccion calendario calendarios calentador calentamiento calentando calentar calentito calentura
calero caleta cali calibre calida calidad calidades calidas calidez calido calidos calienta calientan caliente calientes
califa califato califica calificacion calificaciones calificada calificadas calificado calificados califican calificar
calificativo califico california caligrafia caliz caliza calla callada callado callados callan callao callar callas
calle calleja callejera callejeras callejero callejeros callejon callejones calles callo callos calma calmada calmado
calmar calme calor calorias calumnia calumnias calurosa caluroso calva calvario calvo calza calzada calzado calzoncillos
calzones cama camada camara camarada camaradas camaraderia camaras camarera camarero camareros camarilla camarografo
camaron camarones camas cambia cambiaba cambiaban cambiada cambiado cambiamos cambian cambiando cambiante cambiantes
cambiar cambiara cambiaran cambiaria cambiario cambiaron cambias cambiaste cambie cambiemos cambien cambies cambio
cambios camello camellos camilla camilo camina caminaba caminaban caminado caminamos caminan caminando caminante
caminantes caminar caminas caminata caminatas camine camino caminos camion camionero camioneros camiones camioneta
camionetas camisa camisas camiseta camisetas campa campamento campamentos campana campanario campanas campeche campeon
campeona campeonato campeonatos campeones campera campesina campesinas campesino campesinos campestre camping campo
campos campus camuflaje cana canadiense canadienses canal canales canalizacion canalizar canalla canallas canaria
canarias canario canarios canas canasta cancela cancelacion cancelada cancelado cancelados cancelan cancelar cancelaron
cancele cancelo cancer cancha canchas canciller cancilleria cancion cancionero canciones candado candela candelaria
candente candidata candidatas candidato candidatos candidatura candidaturas candido canela canelones cangrejo cangrejos
canguro canibalismo canina canino canje cannabis cano canoa canoas canon canones canonica canonico canonigo cansa
cansada cansado cansados cansan cansancio cansando cansar canse canso canta cantaba cantaban cantada cantado cantamos
cantan cantando cantante cantantes cantar cantaron cantas cantautor cante canten cantera canteras cantero cantico
canticos cantidad cantidades cantina cantinflas canto canton cantones cantor cantores cantos caos caotica caotico capa
capaces capacidad capacidades capacitacion capacitaciones capacitada capacitado capacitados capacitar caparazon capas
capataz capaz cape capellan capi capilar capilares capilla capillas capita capital capitales capitalino capitalinos
capitalismo capitalista capitalistas capitalizacion capitalizar capitan capitana capitanes capitania capitolio
capitulacion capitular capitulo capitulos capo capos capote capricho caprichos caprichosa caprichoso capricornio capsula
capsulas capta captacion captado captan captar capto captura capturada capturado capturados capturan capturar capturaron
capturas capturo capucha capullo cara carabina carabineros caracol caracoles caracter caracteres caracteristica
caracteristicas caracteristico caracteristicos caracteriza caracterizacion caracterizada caracterizado caracterizan
caracterizar caracterizo caradura carajo carajos caramba caramelo caramelos caras caravana caravanas caray carbon
carbonato carbono carcajada carcajadas carcasa carcel carceles cardenal cardenales cardenas cardiaca cardiaco cardiacos
cardinales cardiovascular cardona carece carecen carecer carecia carecian carencia carencias carente carentes careta
caretas carey carga cargaba cargada cargadas cargado cargador cargadores cargados cargamento cargan cargando cargar
cargaron cargas cargo cargos cargue caribe caricatura caricaturas caricia caricias caridad caries carisma carismatico
carlista carlistas carlota carmelitas carmena carnal carnaval carnavales carne carnero carnes carniceria carnicero caro
carolina caros carpa carpas carpeta carpetas carpinteria carpintero carpinteros carpio carranza carrasco carrera
carreras carrero carreta carretas carrete carretera carreteras carretero carril carriles carrillo carrizo carro
carroceria carros carroza carrozas carruaje carrusel carta cartas cartel cartelera carteles carter cartera carteras
cartero cartilla cartografia carton cartones cartucho cartuchos carvajal casa casaca casacion casada casadas casado
casados casal casamiento casan casanova casar casares casaron casas cascabel cascada cascadas cascara casco cascos case
casen casera caseras caserio casero caseros cases caseta casetas casi casilla casillas casino casinos caso casona casos
caspa casta castas castellana castellano castellanos castidad castiga castigada castigado castigados castigan castigar
castigo castigos castigue castilla castillo castillos casting castor castracion castro casual casuales casualidad
casualidades casualmente cata catalan catalana catalanas catalanes catalina catalizador catalogado catalogar catalogo
catalogos catar catarata cataratas catarsis catastro catastrofe catastrofes catastrofico catecismo catedra catedral
catedrales catedras catedratico catedraticos categoria categorias categoricamente catequesis cato catolica catolicas
catolicismo catolico catolicos catorce cauce cauces caucho caudal caudales caudillo caudillos causa causaba causada
causadas causado causados causal causales causalidad causan causando causante causantes causar causara causaria causaron
causas cause causo cautela cautelar cautelares cautiva cautiverio cautivo cautivos cava cavar cave caverna cavernas
caviar cavidad cavidades cayendo cayera cayeron cayo caza cazador cazadora cazadores cazando cazar cazas cazuela cebada
cebo cebolla cebollas cebra ceda cede ceder cedida cedido cediendo cedio cedro cedula cedulas ceguera ceiba ceja cejas
cela celda celdas celebra celebraba celebraban celebracion celebraciones celebrada celebradas celebrado celebrados
celebramos celebran celebrando celebrar celebrara celebraran celebraron celebre celebremos celebren celebres celebridad
celebridades celebro celeridad celeste celestes celestial celestiales celestino celo celos celosa celoso celosos celtas
celula celular celulares celulas celulitis celulosa cementerio cementerios cemento cena cenando cenar cenas cenicienta
ceniza cenizas censo censor censores censos censura censurado censurar centavo centavos centenar centenares centenario
centeno centimetro centimetros centimo centimos centinela centinelas centra centrada centradas centrado centrados
central centrales centralismo centralista centralizacion centralizada centralizado centran centrar centraron centre
centrica centro centroamericana centroamericano centrocampista centros centurion cepa cepas cepeda cepillo cera ceramica
ceramicas cerca cercado cercana cercanas cercania cercanias cercano cercanos cercas cerco cerda cerdas cerdo cerdos
cereal cereales cerebral cerebrales cerebro cerebros ceremonia ceremonial ceremonias cereza cerezas cerezo cero ceros
cerquita cerraba cerraban cerrada cerradas cerrado cerrados cerradura cerraduras cerramos cerrando cerrar cerrara
cerraron cerre cerro cerrojo cerros certamen certero certeza certificacion certificaciones certificada certificado
certificados certificar cerveceria cerveza cervezas cervical cesa cesado cesar cesarea cese cesion ceso cesped cespedes
cesta cesto cetro chacon chale chaleco chalecos chalet chama chaman chamba chamo chamorro champan champu chamuyo chan
chance chances chancho chango chantaje chao chapa chaparro chapas chaqueta chaquetas charcas charco charla charlamos
charlando charlar charlas charles chasis chata chatarra chatear chato chau chava chaval chavales chaves chavos checa
checo chef chefs chelines cheque chequear chequeo cheques chester chic chica chicas chicha chicle chicles chico chicos
chihuahua chilena chilenas chileno chilenos chiles chillan chimenea chimeneas chin chinas chinchilla chinga chingada
chingados chingar chingo chingon chinos chip chiquilla chiquillo chiquillos chiquita chiquito chiquitos chiringuito
chisme chismes chispa chispas chiste chistes chistoso chivas chivo choca chocan chocante chocar chocaron chocho choco
chocolate chocolates chofer choferes chollo choque choques chorizo chorizos chorradas chorro chorros choto choza chozas
christmas chucha chucho chula churros chusma cianuro cibernetica cibernetico cicatrices cicatriz ciceron ciclismo
ciclista ciclistas ciclo ciclon ciclos ciega ciegamente ciegas ciego ciegos cielo cielos cien cienaga ciencia ciencias
cientifica cientificamente cientificas cientifico cientificos ciento cientos cierra cierran cierras cierre cierren
cierres cierro cierta ciertamente ciertas cierto ciertos ciervo ciervos cifra cifrado cifras cigarrillo cigarrillos
cigarro cigarros cilantro cilindro cilindros cima cimas cimientos cinco cincuenta cine cineasta cineastas cinema
cinematografia cinematografica cinematografico cines cinica cinico cinicos cinismo cinta cintas cinto cintura cinturon
cinturones circo circuito circuitos circula circulaba circulaban circulacion circulan circulando circular circulares
circulo circulos circuncision circundante circundantes circunferencia circunscripcion circunstancia circunstancial
circunstancias cirugia cirugias cirujano cirujanos cisco cisma cisne cisnes cisterna cita citacion citada citadas citado
citados citan citando citar citas cite cito citricos ciudad ciudadana ciudadanas ciudadania ciudadano ciudadanos
ciudadela ciudades civica civicas civico civicos civil civiles civilizacion civilizaciones civilizada civilizado
civilizados civismo clama clamor clan clandestina clandestinas clandestinidad clandestino clandestinos clanes clara
claramente claras claridad clarificar clarin claro claros clase clases clasica clasicas clasico clasicos clasifica
clasificacion clasificaciones clasificada clasificadas clasificado clasificados clasifican clasificar clasifico clasista
claudia claustro clausula clausulas clausura clausurado clava clavada clavado clavados clavar clave claveles claves
clavo clavos clemencia clemente clerigo clerigos clero clic cliche cliches cliente clientela clientes clima climas
climatica climaticas climatico climaticos climax clinica clinicas clinico clinicos clip clips clitoris cloaca cloacas
clon clones cloro cloruro closet club clubes clubs coaccion coagulacion coalicion coaliciones coartada coautor cobarde
cobardes cobardia cobertura coberturas cobija cobijo cobo cobos cobra cobraba cobraban cobrado cobran cobrando cobrar
cobrara cobraron cobras cobre cobren cobro cobros coca coccion cocer coche cochera coches cochino cocida cocido cocidos
cociente cocina cocinado cocinan cocinando cocinar cocinas cocine cocinera cocinero cocineros cocino coco cocodrilo
cocodrilos cocos coctel cocteles codice codices codicia codificacion codificar codigo codigos codo codos coeficiente
coeficientes coercion coexistencia cofradia cofradias cofre cofundador cogi cogia cogida cogido cogiendo cogieron
cognitiva cognitivas cognitivo cognitivos coherencia coherente coherentes cohesion cohete cohetes coimas coincida
coincide coinciden coincidencia coincidencias coincidiendo coincidieron coincidimos coincidio coincidir coincido coito
coja cojan cojin cojo cola colabora colaboracion colaboraciones colaborado colaborador colaboradora colaboradores
colaboran colaborando colaborar colaboraron colaboro colacion colada colado colapsa colapsado colapsar colapso colar
colas colateral colaterales colchon colchones cole coleccion coleccionar colecciones coleccionista coleccionistas
colecta colectiva colectivas colectividad colectivo colectivos colector colega colegas colegiado colegial colegiales
colegio colegios colera colesterol coleta colgada colgadas colgado colgados colgando colgante colgantes colgar colgaron
colgo colgue colima colina colinas colindantes coliseo colision collado collage collar collares colmena colmenares
colmillos colmo colo coloca colocaba colocacion colocada colocadas colocado colocados colocamos colocan colocando
colocar colocaron coloco colombiana colombianas colombiano colombianos colombo colon colonia colonial coloniales
colonialismo colonias colonizacion colonizadores colonos coloque coloquial coloquio color coloracion colorada colorado
colorados colorante colorantes colorear colores colorida colorido coloridos colosal coloso columna columnas columnista
coma coman comandancia comandante comandantes comando comandos comarca comarcal comarcas comas combate combaten combates
combatiendo combatiente combatientes combatio combatir combina combinacion combinaciones combinada combinadas combinado
combinados combinan combinando combinar combo combustible combustibles combustion come comedia comediante comediantes
comedias comedor comedores comemos comen comence comencemos comendador comensales comenta comentaba comentada comentado
comentamos comentan comentando comentar comentario comentarios comentarista comentaristas comentaron comentas comente
comenten comento comenzaba comenzaban comenzado comenzamos comenzando comenzar comenzara comenzaran comenzaremos
comenzaria comenzaron comenzo comer comercial comerciales comercializa comercializar comerciante comerciantes comerciar
comercio comercios comeria comes comestible comestibles cometa cometan cometas comete cometemos cometen cometer cometi
cometida cometidas cometido cometidos cometiendo cometieron cometio comi comia comian comic comica comicas comicios
comico comicos comics comida comidas comido comience comiencen comiendo comienza comienzan comienzas comienzo comienzos
comieron comillas comimos comino comio comisaria comisarias comisario comisarios comision comisionado comisionados
comisiones comiste comite comites comitiva como comoda comodamente comodas comodidad comodidades comodin comodo comodoro
comodos compacta compacto compactos compadre compara comparable comparables comparacion comparaciones comparada
comparadas comparado comparados comparamos comparan comparando comparar comparativa comparativo compare comparecencia
comparecer comparo comparsa comparsas comparta compartan comparte comparten compartes comparti compartia compartian
compartida compartidas compartido compartidos compartiendo compartieron compartimento compartimos compartio compartir
comparto compas compases compasion compasivo compatibilidad compatible compatibles compatriota compatriotas compendio
compensa compensacion compensaciones compensar compete competencia competencias competente competentes competicion
competiciones competidor competidores competir competitiva competitivas competitividad competitivo competitivos
compilacion compilado compite compiten compitiendo complace complacer complacido complaciente compleja complejas
complejidad complejo complejos complementa complementan complementar complementaria complementarias complementario
complementarios complemento complementos completa completada completado completamente completan completando completar
completas complete completo completos complica complicacion complicaciones complicada complicadas complicado complicados
complican complicar complice complices complicidad complico complot complutense compone componen componente componentes
componer comporta comportamiento comportamientos comportan composicion composiciones compositor compositores compostura
compra compraba comprada compradas comprado comprador compradores comprados compramos compran comprando comprar comprara
comprare compraria compraron compras compraste compraventa compre compren comprenda comprendan comprende comprendemos
comprenden comprender comprendera comprendes comprendi comprendia comprendida comprendidas comprendido comprendidos
comprendiendo comprendio comprendo comprensible comprension comprensiva comprensivo compres compresion compresor
comprimido compro comprobacion comprobada comprobado comprobando comprobante comprobantes comprobar comprobo compromete
comprometen comprometer comprometida comprometidas comprometido comprometidos comprometieron comprometio compromiso
compromisos comprueba compruebe compuertas compuesta compuestas compuesto compuestos compulsivo compuso computacion
computador computadora computadoras computadores computo comun comuna comunal comunales comunas comuneros comunes
comunica comunicaba comunicacion comunicacional comunicaciones comunicada comunicado comunicador comunicadores
comunicados comunicamos comunican comunicando comunicar comunicaron comunicativa comunico comunidad comunidades comunion
comunique comunismo comunista comunistas comunitaria comunitarias comunitario comunitarios comunmente concebida
concebido concebir conceda concede conceden conceder concedida concedidas concedido concedidos concedieron concedio
concejal concejala concejales concejo concejos concentra concentracion concentraciones concentrada concentrado
concentrados concentran concentrar concentraron concentro concepcion concepciones concepto conceptos conceptual
conceptuales concerniente concernientes concertacion concertada concertado concertar concesion concesionaria
concesionario concesionarios concesiones concibe concibio conciencia concienciacion concienciar conciencias
concientizacion concientizar concierne concierto conciertos conciliacion conciliar concilio concisa conciudadanos
conclave concluida concluido concluir conclusion conclusiones concluye concluyen concluyendo concluyente concluyeron
concluyo concordancia concordia concrecion concreta concretar concretas concreto concretos concuerda concuerdan
concuerdo concurrencia concurrido concurrir concursante concursantes concurso concursos condado condados conde
condecoracion condecoraciones condecorado condena condenada condenadas condenado condenados condenamos condenan
condenando condenar condenaron condenas condeno condensacion condensada condes condesa condescendiente condicion
condiciona condicionada condicionado condicional condiciones condimentos condolencias condominio condon condones condor
conduccion conduce conducen conducia conducida conducido conducidos conduciendo conducir conducira conducta conductas
conducto conductor conductora conductores conductos condujeron condujo conduzca conduzcan conecta conectada conectadas
conectado conectados conectan conectando conectar conecte conecto conector conejo conejos conexion conexiones confeccion
confeccionar confederacion confederaciones conferencia conferencias confesado confesar confesion confesiones confeso
confesor confia confiaba confiabilidad confiable confiables confiada confiado confiados confiamos confian confiando
confianza confiar confias confidencial confidenciales confidente confie confien confiere confies confiesa confieso
configura configuracion configuraciones configurado configuran configurar confinado confinamiento confines confio
confirma confirmacion confirmada confirmadas confirmado confirmados confirman confirmando confirmar confirmaron confirme
confirmo confiscacion conflictiva conflictivo conflicto conflictos confluencia confluyen conforma conformacion
conformada conformado conforman conformando conformar conforme conformes conformidad conformo confort confortable
confrontacion confrontar confunda confundan confundas confunde confunden confundi confundida confundido confundidos
confundiendo confundio confundir confusa confusas confusion confusiones confuso confusos congela congelacion congelada
congeladas congelado congelador congelados congelar congestion conglomerado conglomerados congregacion congregaciones
congresista congresistas congreso congresos congruencia conjetura conjeturas conjugacion conjuncion conjunta
conjuntamente conjuntas conjunto conjuntos conjuro conlleva conllevan conmemora conmemoracion conmemorar conmemorativa
conmemorativo conmigo conmocion conmovedor conmovedora conmovido conmovio conmueve connivencia connotacion connotaciones
cono conoce conocedor conocedores conoceis conocemos conocen conocer conocera conoceran conoceras conoceremos conoceria
conoces conoci conocia conociamos conocian conocias conocida conocidas conocido conocidos conociendo conociera
conocieran conocieron conocimiento conocimientos conocimos conocio conociste conos conozca conozcamos conozcan conozcas
conozco conque conquista conquistada conquistado conquistador conquistadores conquistados conquistando conquistar
conquistas conquisto consagra consagracion consagrada consagrado consagrados consagro consciencia consciente conscientes
consecucion consecuencia consecuencias consecuente consecuentes consecutiva consecutivas consecutivo consecutivos
consegui conseguia conseguida conseguido conseguidos conseguimos conseguir conseguira conseguiran conseguiras
conseguiremos conseguiria conseguiste consejera consejeria consejero consejeros consejo consejos consenso consensos
consentido consentimiento consentir conserje conserva conservacion conservada conservado conservador conservadora
conservadoras conservadores conservados conservadurismo conservan conservando conservar conservas conservatorio conserve
conservo considera consideraba consideraban considerable considerables consideracion consideraciones considerada
consideradas considerado considerados consideramos consideran considerando considerar considerara consideraran
consideraria consideraron consideras considere consideremos consideren consideres considero consiente consiga consigan
consigas consigna consignas consigo consigue consiguen consigues consiguiendo consiguiente consiguiera consiguieron
consiguio consiste consisten consistencia consistente consistentes consistia consistio consistorio consola consolacion
consolador consolar consolas consolida consolidacion consolidada consolidado consolidando consolidar consolido
consonancia consonantes consorcio consorte conspiracion conspiraciones conspiradores conspirar consta constaba constan
constancia constante constantemente constantes constar constata constatar conste constelacion constelaciones
constitucion constitucional constituciones constituia constituian constituida constituidas constituido constituidos
constituir constituye constituyen constituyendo constituyente constituyentes constituyeron constituyo construccion
construcciones constructiva constructivas constructivo constructivos constructor constructora constructoras
constructores construida construidas construido construidos construimos construir construira construya construyan
construye construyen construyendo construyeron construyo consuela consuelo consul consulado consulados consular
consulares consules consulta consultada consultado consultados consultando consultar consultas consulte consultiva
consultivo consulto consultor consultora consultores consultoria consultorio consultorios consuma consumado consume
consumen consumia consumida consumido consumidor consumidores consumidos consumiendo consumimos consumio consumir
consumismo consumo consumos conta contaba contaban contabilidad contable contables contacta contactado contactar
contacte contacto contactos contada contadas contado contador contadores contados contaduria contagio contagiosa
contagioso contamina contaminacion contaminada contaminado contaminados contaminante contaminantes contaminar contamos
contando contar contara contaran contare contaria contaron contas contaste conte contempla contemplaba contemplacion
contemplado contemplados contemplan contemplando contemplar contemporanea contemporaneas contemporaneo contemporaneos
contencion contencioso contendientes contenedor contenedores contener contenga contengan contenia contenian contenida
contenidas contenido contenidos conteniendo contenta contento contentos conteo contesta contestaba contestacion
contestado contestan contestando contestar contestaron contestas conteste contesten contestes contesto contexto
contextos contienda contiene contienen contigo contigua continental continentales continente continentes contingencia
contingente contingentes continua continuaba continuaban continuacion continuada continuado continuamente continuamos
continuan continuando continuar continuara continuaran continuaremos continuaria continuaron continuas continue
continuen continuidad continuo continuos conto contorno contornos contra contraataque contrabandistas contrabando
contraccion contracciones contractual contractuales contradecir contradiccion contradicciones contradice contradicen
contradictoria contradictorias contradictorio contradictorios contrae contraer contraido contrajo contralor contraloria
contrapartida contrapeso contraposicion contrapunto contraria contrariamente contrarias contrario contrarios
contrarrestar contras contrasta contrastar contraste contrastes contrata contratacion contrataciones contratada
contratado contratados contratan contratando contratante contratar contrataron contrate contratiempo contratiempos
contratista contratistas contrato contratos contreras contribucion contribuciones contribuido contribuir contribuira
contribuya contribuyan contribuye contribuyen contribuyendo contribuyente contribuyentes contribuyeron contribuyo
contrincante contrincantes control controla controlaba controlada controladas controlado controlador controladores
controlados controlan controlando controlar controle controlen controles controversia controversial controversias
controvertida controvertido contundencia contundente contundentes convence convencen convencer convencida convencido
convencidos convencieron convencimiento convencio convencion convencional convencionales convenciones convendria
convenga convenia conveniencia conveniente convenientes convenio convenios convento conventos convergen convergencia
conversa conversacion conversaciones conversamos conversando conversar conversion conversiones converti convertia
convertible convertida convertido convertidos convertimos convertir convertira convertiran convertiria conviccion
convicciones convicto convictos conviene convierta conviertan convierte convierten conviertes convincente convincentes
convirtiendo convirtiera convirtieron convirtio conviven convivencia convivir convoca convocada convocadas convocado
convocados convocan convocando convocar convocaron convocatoria convocatorias convoco convoque convoy convulsiones
conyugal conyuge conyuges cooperacion cooperar cooperativa cooperativas cooperativo coordenadas coordina coordinacion
coordinada coordinado coordinador coordinadora coordinadores coordinados coordinar copa copada copado copas cope copia
copiado copian copiando copiar copias copiloto copio copla coplas copo coqueta cora coraje coral corales coraza corazon
corazones corbata corcho cordero corderos cordial cordiales cordialidad cordillera cordilleras cordoba cordobes
cordobesa cordobeses cordon cordones cordura core coreana coreano coreanos coreografia corintios cornejo corner corneta
cornisa corno cornudo coro corona coronacion coronada coronado coronas coronel corono coros corporacion corporaciones
corporal corporales corporativa corporativas corporativo corporativos corps corpus corra corral corrales corran corras
corre correa correas correccion correccional correcciones correcta correctamente correctas correcto corrector correctos
corredor corredores corregida corregido corregidor corregimiento corregir correlacion corremos corren correo correos
correr correra corres corresponda correspondan corresponde corresponden correspondencia corresponder corresponderia
correspondia correspondian correspondido correspondiente correspondientes correspondio corresponsal corresponsales corri
corria corrian corrida corridas corrido corridos corriendo corriente corrientes corrieron corrige corrigiendo corrigio
corrio corro corroborar corrompe corromper corrompido corrosion corrupcion corrupta corruptas corrupto corruptos corso
corta cortaba cortada cortadas cortado cortados cortamos cortan cortando cortante cortar cortaron cortas corte cortejo
corten cortes cortesia corteza cortijo cortina cortinas corto cortometraje cortometrajes cortos corzo cosa cosas cosecha
cosechado cosechando cosechar cosechas coser cosmetica cosmeticos cosmica cosmico cosmopolita cosmos cosmovision coso
cosquillas costa costaba costado costados costal costando costanera costar costara costaria costaron costarricense
costarricenses costas coste costear costera costeras costero costeros costes costilla costillas costo costos costosa
costosas costoso costosos costumbre costumbres costura cota cotas cotejo cotidiana cotidianas cotidianidad cotidiano
cotidianos cotiza cotizacion cotizaciones cotizar coto coyote coyuntura craneo craneos crater crea creaba creacion
creaciones creada creadas creado creador creadora creadores creados creamos crean creando crear creara crearia crearon
creas creativa creativas creatividad creativo creativos crece crecen crecer crecera creces creci crecia crecida crecido
creciendo creciente crecientes crecieron crecimiento crecimos crecio credencial credenciales credibilidad credito
creditos credo cree creed creeis creemos creen creencia creencias creer creera creeras creeria crees crei creia creiamos
creian creias creible creibles creido creimos creiste crema cremallera cremas creo crepusculo crespo cresta creta
creyendo creyente creyentes creyera creyeron creyo crezca crezcan cria criada criadas criado criadores criados crian
criando crianza criar criaron crias criatura criaturas crimen crimenes criminal criminales criminalidad criminalizar
criminologia crio criolla criollo criollos cripta crisis crisol cristal cristales cristalina cristalino cristiana
cristianas cristiandad cristianismo cristiano cristianos cristina cristo criterio criterios critica criticaba criticaban
criticada criticado criticamente critican criticando criticar criticaron criticas critico criticos critique critiquen
croata croatas cromo cromosoma cromosomas cronica cronicas cronico cronicos cronista cronistas cronograma cronologia
cronologico croquetas cruce crucero cruceros cruces crucial cruciales crucificado crucifijo cruda crudas crudo crudos
cruel crueldad crueles crujiente cruz cruza cruzaba cruzada cruzadas cruzado cruzados cruzamos cruzan cruzando cruzar
cruzaron cruzas cruzo cuaderno cuadernos cuadra cuadrada cuadradas cuadrado cuadrados cuadrante cuadras cuadrilatero
cuadrilla cuadrillas cuadro cuadros cual cuales cualesquiera cualidad cualidades cualificacion cualificado cualificados
cualitativo cualquier cualquiera cuan cuando cuanta cuantas cuantia cuantica cuantico cuantificar cuantitativa cuanto
cuantos cuarenta cuarentena cuaresma cuarta cuartas cuartel cuarteles cuarteto cuarto cuartos cuarzo cuatrimestre cuatro
cuatrocientos cubana cubanas cubano cubanos cubas cubeta cubicos cubierta cubiertas cubierto cubiertos cubo cubos cubra
cubran cubre cubren cubria cubrian cubriendo cubrieron cubrimos cubrio cubrir cubrira cucaracha cucarachas cuchara
cucharada cucharadas cuchilla cuchillas cuchillo cuchillos cuco cuelga cuelgan cuelgo cuello cuellos cuenca cuencas
cuenco cuenta cuentan cuentas cuente cuenten cuentes cuento cuentos cuerda cuerdas cuerdo cuerno cuernos cuero cuerpo
cuerpos cuervo cuervos cuesta cuestan cuestas cueste cuestion cuestiona cuestionable cuestionada cuestionado
cuestionamiento cuestionan cuestionando cuestionar cuestionario cuestiones cuestiono cueva cuevas cuida cuidaba cuidad
cuidada cuidado cuidador cuidadores cuidados cuidadosa cuidadosamente cuidadoso cuidadosos cuidamos cuidan cuidando
cuidar cuidas cuide cuiden cuides cuido culata culebra culera culero culinaria culinarias culinario culmina culminacion
culminante culminar culmino culpa culpabilidad culpable culpables culpan culpando culpar culpas culpes culpo culta
cultiva cultivada cultivadas cultivado cultivan cultivando cultivar cultivo cultivos culto cultos cultura cultural
culturales culturas culture cumana cumbia cumbre cumbres cumpla cumplan cumplas cumple cumplen cumples cumpli cumplia
cumplian cumplida cumplidas cumplido cumplidos cumpliendo cumpliera cumplieron cumplimiento cumplimos cumplio cumplir
cumplira cumpliran cumplo cumulo cuna cuneta cuota cuotas cupido cupo cupon cupones cupos cupula cupulas cura curacion
curado curador curan curar curas cure curia curiosa curiosamente curiosas curiosidad curiosidades curioso curiosos curo
curricular curriculo curro cursa cursado cursando cursar cursi cursiva curso cursos curtis curva curvas curvatura
cuspide custodia custodio cutre cuya cuyo daba dabas dada dado dados daga dais dallas dama damas damasco damnificados
danesa daneses danza danzas dara dardo dardos dare daremos darian darias data datan date dato datos deal dean deba
debacle debajo debamos deban debas debate debaten debates debatido debatiendo debatir debe debeis debemos deben deber
debera deberan deberas deberemos deberes deberia deberiais deberiamos deberian deberias debes debi debia debiamos debian
debida debidamente debidas debido debidos debiendo debiera debieran debieron debil debiles debilidad debilidades
debilita debilitado debilitamiento debilitar debio debiste debito debo debut debuta debutar debuto decada decadas
decadencia decadente decano decapitado decena decenas decencia decente decentes decepcion decepciona decepcionada
decepcionado decepcionados decepcionante decepcionar decepciones decepciono deceso deci decia deciamos decian decias
decida decidan decidas decide deciden decides decidi decidia decidida decididamente decidido decididos decidiendo
decidiera decidieron decidimos decidio decidir decidira decidiran decidiste decido decima decimal decimas decimo decimos
decir decis decision decisiones decisiva decisivas decisivo decisivos declara declaraba declaracion declaraciones
declarada declaradas declarado declarados declaran declarando declarar declararon declaratoria declare declaren declaro
declive decoracion decoraciones decorada decoradas decorado decorados decorar decorativas decorativo decorativos decoro
decreciente decreta decretado decretar decreto decretos dedica dedicaba dedicaban dedicacion dedicada dedicadas dedicado
dedicados dedicamos dedican dedicando dedicar dedicaron dedicas dedicatoria dedico dedique dediquen dedo dedos deduccion
deducciones deduce deducir defecto defectos defectuosa defectuoso defendemos defender defendera defendia defendian
defendida defendido defendiendo defendieron defendio defensa defensas defensiva defensivas defensivo defensor defensora
defensores defensoria deficiencia deficiencias deficiente deficientes deficit defienda defiendan defiende defienden
defiendes defiendo defina define definen definia definicion definiciones definida definidas definido definidos
definiendo definieron definio definir definitiva definitivamente definitivas definitivo definitivos deforestacion
deformacion deforme defraudado defraudar defuncion degeneracion degenerado degradacion degradado dehesa deidad deidades
deis deja dejaba dejaban dejada dejado dejados dejamos dejan dejando dejar dejara dejaran dejaras dejare dejaremos
dejaria dejarian dejaron dejas dejase dejaste deje dejeis dejemos dejen dejes dejo delantal delante delantera delanteras
delantero delanteros delata dele delegacion delegaciones delegada delegado delegados delegar deleite delfin delfina
delfines delgada delgadas delgado delgados delia deliberacion deliberaciones deliberada deliberado deliberante delicada
delicadas delicadeza delicado delicados delicia delicias deliciosa deliciosas delicioso deliciosos delictiva delictivas
delictivo delictivos delimitacion delimitar delincuencia delincuente delincuentes delinquir delirante delirio delirios
delito delitos della delta demagogia demanda demandada demandado demandados demandan demandando demandante demandantes
demandar demandas demando demarcacion demasiada demasiadas demasiado demasiados demencia demente demo democracia
democracias democrata democratas democratica democraticas democratico democraticos democratizacion demografia
demografica demografico demograficos demoler demolicion demonio demonios demora demorar demoras demoro demos demostraba
demostracion demostraciones demostrada demostrado demostrando demostrar demostrara demostraron demostro demuestra
demuestran demuestras demuestre demuestren denegacion denegada denegado dengue denomina denominacion denominaciones
denominada denominadas denominado denominador denominados denominan denominar denomino denota densa densas densidad
denso densos dentadura dental dentales dentista dentistas dentro denuncia denunciaba denunciada denunciado denunciados
denuncian denunciando denunciante denunciar denunciaron denuncias denuncie denuncien denuncio depara departamental
departamentales departamento departamentos dependa depende dependemos dependen dependencia dependencias depender
dependera dependia dependiendo dependiente dependientes deplorable deportacion deportado deportados deportar deporte
deportes deportista deportistas deportiva deportivas deportivo deportivos deposita depositado depositados depositan
depositar deposito depositos depreciacion depredador depredadores depresion depresiones depresivo deprime deprimente
deprimida deprimido deprisa depuesto depuracion derbi derecha derechas derechista derechistas derecho derechos deriva
derivacion derivada derivadas derivado derivados derivan derivar derivo derogacion derogar derrama derramada derramado
derramamiento derramar derrame derrames derramo derribado derribar derribo derrite derrocado derrocamiento derrocar
derroche derroco derrota derrotada derrotado derrotados derrotar derrotas derroto derrumba derrumbe derrumbo desacato
desaceleracion desacreditar desactivado desactivar desacuerdo desacuerdos desafia desafiando desafiante desafiar desafio
desafios desafortunada desafortunado desagradable desagradables desagrado desague desagues desahogo desahucio desahucios
desalojar desalojo desamor desamparados desaparece desaparecen desaparecer desaparecera desaparecida desaparecidas
desaparecido desaparecidos desapareciendo desaparecieron desaparecio desaparezca desaparezcan desaparicion
desapariciones desapercibida desapercibido desapercibidos desaprobacion desarmado desarmados desarmar desarme desarrolla
desarrollaba desarrollada desarrolladas desarrollado desarrollados desarrollamos desarrollan desarrollando desarrollar
desarrollara desarrollaron desarrolle desarrollen desarrollo desarrollos desastre desastres desastrosa desastroso desata
desatada desatado desatar desato desayunar desayuno desayunos desbloquear desborda desborde descabellado descalificacion
descalzo descalzos descansa descansado descansan descansando descansar descanse descansen descanso descansos descarada
descaradamente descarado descarga descargado descargando descargar descargas descargo descargue descaro descarta
descartada descartado descartar descarte descartes descarto descendencia descendente descender descendido descendiendo
descendiente descendientes descendio descenso descentralizada descentralizado desciende descienden descifrar
descomposicion descompuesto descomunal desconcertado desconcertante desconcierto desconectado desconectar desconexion
desconfiado desconfianza desconfiar desconoce desconocemos desconocen desconocer desconocia desconocida desconocidas
desconocido desconocidos desconocimiento desconozco descontento descontentos descontrol descontrolada descredito
describe describen describia describiendo describieron describio describir descripcion descripciones descriptiva
descriptivo descrita descritas descrito descritos descubierta descubiertas descubierto descubiertos descubra descubran
descubre descubren descubres descubri descubridor descubriendo descubrieron descubrimiento descubrimientos descubrimos
descubrio descubrir descubrira descubriras descubro descuento descuentos descuida descuidada descuidado descuidar
descuido desden dese desea deseaba deseaban deseable deseada deseadas deseado deseados deseamos desean deseando desear
desearia deseas desechable desechables desechar desecho desechos desee deseen desees desembarcar desembarco desemboca
desembocadura desembocar desempleado desempleados desempleo desencadena desencadenar desencadeno desencanto desenlace
desenmascarar deseo deseos deseosos desequilibrio desequilibrios desercion desertores desespera desesperacion
desesperada desesperadas desesperado desesperados desesperante desesperanza desestabilizar desestimar desestimo
desfavorable desfavorables desfavorecidos desfilar desfile desfiles desgaste desglose desgracia desgraciada desgraciado
desgraciados desgracias deshace deshacer deshecho deshidratacion deshizo deshonesto deshonra desidia desierta desierto
desiertos designa designacion designaciones designada designadas designado designados designar designo desigual
desigualdad desigualdades desiguales desilusion desilusionado desinformacion desintegracion desinteres desinteresada
desistir desleal desliza deslizamiento deslumbrante desmadre desmanes desmantelar desmayo desmedida desmentido desmentir
desmiente desmintio desmontar desnivel desnutricion desobedecer desobediencia desocupacion desodorante desolacion
desolado desorden desordenada desordenado desordenes despacho despachos despacio despacito despecho despectivo despedida
despedidas despedido despedidos despedimos despedir despegar despegue despejada despejado despejar despenalizacion
despensa desperdiciar desperdicio desperdicios despertaba despertado despertador despertamos despertando despertar
despertaron desperte desperto despiadada despiadado despide despiden despidiendo despidieron despidio despido despidos
despierta despiertan despiertas despierte despierten despierto despiertos despilfarro despistado desplaza desplazada
desplazadas desplazado desplazados desplazamiento desplazamientos desplazan desplazando desplazar desplazo desplegado
desplegados desplegar desplego despliega despliegue desplome desplomo despojado despojo desprecia despreciable
despreciables desprecian despreciar desprecio desprende desprenden desprendimiento desprestigiar desprestigio despues
destaca destacaba destacable destacada destacadas destacado destacados destacamento destacan destacando destacar
destacaron destaco destapar destello destellos desterrado destierro destilacion destina destinada destinadas destinado
destinados destinan destinar destinatario destinatarios destino destinos destitucion destituido destituir destreza
destrezas destroza destrozada destrozado destrozados destrozando destrozar destrozo destrozos destruccion destructiva
destructivo destructor destructores destruida destruidas destruido destruidos destruir destruya destruyan destruye
destruyen destruyendo destruyeron destruyo desuso desvanece desvela desventaja desventajas desvia desviacion
desviaciones desviado desviar desvio desvios detalla detallada detalladamente detalladas detallado detallados detallan
detallar detalle detalles detallo deteccion detecta detectado detectados detectan detectar detectaron detective
detectives detecto detector detectores detencion detenciones detendra detener detenga detengan detenida detenidamente
detenidas detenido detenidos deteniendo detenimiento detergente deteriorado deterioro determina determinacion
determinada determinadas determinado determinados determinan determinante determinantes determinar determinara
determinaron determine determinen determino detesta detestable detesto detiene detienen detonante detractores detras
detrimento detuve detuviera detuvieron detuvo deuda deudas deudor deudores devaluacion devastacion devastada devastado
devastador devastadora devenir devocion devolucion devoluciones devolver devolvera devolviendo devolvieron devolvio
devota devoto devotos devuelta devuelto devueltos devuelva devuelvan devuelve devuelven devuelvo diabetes diablo diablos
diabolico diadema diafragma diagnosticado diagnosticar diagnosticaron diagnostico diagnosticos diagonal diagrama
diagramas dial dialectica dialecto dialectos dialogar dialogo dialogos diamante diamantes diametro diana diapositivas
diaria diariamente diarias diario diarios diarrea dias diaspora dibuja dibujado dibujan dibujando dibujante dibujantes
dibujar dibujo dibujos diccionario diccionarios dice dicen dices dicha dichas dicho dichos dichosa dichoso diciembre
diciendo dicotomia dicta dictada dictadas dictado dictador dictadores dictados dictadura dictaduras dictamen dictamino
dictan dictar dictatorial dictatoriales dicte dicto didactica didactico didacticos diecinueve dieciocho dieciseis
diecisiete diente dientes dieran dieras dieron diese diesel diestra diestro dieta dietas diez difamacion difamar
diferencia diferenciacion diferenciada diferenciadas diferenciado diferenciados diferencial diferenciales diferencian
diferenciar diferencias diferente diferentes diferido dificil dificiles dificilmente dificulta dificultad dificultades
dificultan dificultar difiere difieren difundan difunde difunden difundida difundidas difundido difundidos difundiendo
difundio difundir difunta difunto difuntos difusa difusion diga digamos digan digas digerir digestion digestivo digital
digitales digitos digna dignamente dignas dignatarios dignidad digno dignos digo dije dijera dijeran dijeras dijeron
dijese dijimos dijiste dijo dilatacion dilatada dilema dilemas diligencia diligencias diluvio dime dimension dimensiones
diminuta diminutas diminutivo diminuto diminutos dimision dimite dimitido dimitio dimitir dina dinamica dinamicas
dinamico dinamicos dinamismo dinamita dinastia dinero dineros dino dinos dinosaurio dinosaurios diocesano diocesis dios
diosa diosas dioses dioxido diploma diplomacia diplomado diplomas diplomatica diplomaticas diplomatico diplomaticos
diputacion diputaciones diputada diputado diputados dique diques dira dire direccion direcciones directa directamente
directas directiva directivas directivo directivos directo director directora directores directorio directos directrices
diremos dirian dirias dirige dirigen dirigencia dirigente dirigentes dirigi dirigia dirigian dirigida dirigidas dirigido
dirigidos dirigiendo dirigieron dirigimos dirigio dirigir dirigira dirija dirijan dirijo discapacidad discapacidades
discapacitado discapacitados discernir disciplina disciplinaria disciplinario disciplinas discipulo discipulos disco
discografica discografico disconformidad discordia discos discoteca discotecas discrecion discrepancia discrepancias
discrepar discreta discretamente discreto discretos discrimina discriminacion discriminar discriminatorio disculpa
disculpar disculpas disculpe disculpen disculpo discurre discurso discursos discusion discusiones discuta discute
discuten discutia discutible discutida discutido discutiendo discutieron discutimos discutio discutir discuto
disertacion disfraces disfraz disfrazada disfrazado disfrazados disfrazar disfruta disfrutaba disfrutado disfrutamos
disfrutan disfrutando disfrutar disfrutaron disfrutas disfrute disfruten disfrutes disfruto disfuncion disgusta
disgustado disgusto disgustos disidencia disidente disidentes disimular disipar disminucion disminuido disminuir
disminuya disminuye disminuyen disminuyendo disminuyeron disminuyo disolucion disolver disolvio dispara disparado
disparan disparando disparar dispararon disparate disparates dispares disparidad disparo disparos dispersa dispersas
dispersion dispersos dispondra dispone disponemos disponen disponer disponga dispongo disponia disponian disponibilidad
disponible disponibles disposicion disposiciones dispositivo dispositivos dispuesta dispuestas dispuesto dispuestos
dispuso disputa disputada disputado disputan disputar disputas disputo distancia distanciamiento distancias distante
distantes distincion distinciones distingue distinguen distinguida distinguido distinguidos distinguio distinguir
distinta distintas distintiva distintivo distintivos distinto distintos distorsion distorsionada distorsiones
distraccion distracciones distrae distraer distraido distribucion distribuciones distribuida distribuidas distribuido
distribuidor distribuidora distribuidores distribuidos distribuir distribuye distribuyen distribuyo distrito distritos
disturbios disuadir disuelta disuelto disuelve diva divas divergencia divergentes diversa diversas diversidad
diversificacion diversificar diversion diversiones diverso diversos divertida divertidas divertido divertidos divertir
divide dividen dividendo dividendos dividida divididas dividido divididos dividiendo dividieron dividio dividir divierte
divierten divina divinas divinidad divino divinos divisa divisas division divisiones divisoria divorciada divorciado
divorciados divorcio divorcios divulgacion divulgar dobla doblada dobladas doblado doblaje doblando doblar doble
doblemente dobles doblete doce docena docenas docencia docente docentes docil doctor doctora doctorado doctorados
doctoral doctores doctrina doctrinas documenta documentacion documentada documentadas documentado documentados
documental documentales documentar documento documentos dogma dogmas dolar dolares dolencia dolencias doler dolia dolido
dolio dolo dolor dolores dolorosa dolorosas doloroso dolorosos domestica domesticas domestico domesticos domiciliaria
domiciliario domicilio domicilios domina dominaba dominacion dominada dominadas dominado dominados dominan dominando
dominante dominantes dominar domine domingo domingos dominica dominical dominicana dominicano dominicanos dominico
dominicos dominio dominios domino domo dona donacion donaciones donado donados donante donantes donar donas donativo
donativos doncella doncellas dondequiera done dones dono donoso dopaje dopamina doquier dora dorada doradas dorado
dorados dormia dormian dormida dormido dormidos dormimos dormir dormire dormitorio dormitorios dorsal dorsales dorso
doscientas doscientos dosis dossier dota dotacion dotada dotado dotados dotar dote dotes dragon dragones drama dramas
dramatica dramaticamente dramaticas dramatico dramaticos dramaturgo drastica drastico drenaje dual dualidad duarte
ducado ducados ducha duchas duda dudaba dudado dudan dudando dudar dudas dude duden dudes dudo dudosa dudoso dudosos
duela duele duelen duelo duelos duende duendes duerma duerman duermas duerme duermen duermes duermo dueto dulce dulces
dulzura dunas dupla duplica duplicado duplicar duque duques duquesa dura duraba duracion duradera duraderas duradero
durado duramente duran durante durar durara duraria duraron duras durazno dure duren dureza durmiendo durmiente durmio
duro duros ebria ebriedad ebrio ebrios ebullicion echa echaba echada echado echamos echan echando echar echare echaremos
echaron echas eche echen eches echo eclesiastica eclesiasticas eclesiastico eclesiasticos eclipse ecografia ecologia
ecologica ecologicas ecologico ecologicos ecologista ecologistas economia economias economica economicamente economicas
economico economicos economista economistas ecos ecosistema ecosistemas ecuacion ecuaciones ecuador ecuatorial
ecuatoriana ecuatoriano ecuatorianos edad edades edema eden edicion ediciones edicto edificacion edificaciones edificar
edificio edificios edil edita editada editadas editado editados editando editar edito editor editora editores editorial
editoriales educa educacion educacional educacionales educada educado educador educadora educadores educados educando
educar educativa educativas educativo educativos efectiva efectivamente efectivas efectividad efectivo efectivos efecto
efectos efectua efectuada efectuadas efectuado efectuados efectuar efectuara efectuaron efectuo efemerides eficaces
eficacia eficaz eficazmente eficiencia eficiente eficientemente eficientes efigie efimera efimero egipcia egipcias
egipcio egipcios egoismo egoista egoistas egos egresado egresados egresos ejecucion ejecuciones ejecuta ejecutada
ejecutadas ejecutado ejecutados ejecutan ejecutando ejecutar ejecutaron ejecute ejecutiva ejecutivas ejecutivo
ejecutivos ejecuto ejecutor ejem ejemplar ejemplares ejemplo ejemplos ejerce ejercen ejercer ejercia ejercicio
ejercicios ejercida ejercido ejerciendo ejercieron ejercio ejercitar ejercito ejercitos ejerza ejes ejido elabora
elaboracion elaborada elaboradas elaborado elaborados elaboran elaborando elaborar elaboro elastica elasticidad elastico
eleccion elecciones electa electo elector electorado electoral electorales electores electos electrica electricas
electricidad electricista electrico electricos electrificacion electro electrodos electrones electronica electronicas
electronico electronicos elefante elefantes elegancia elegante elegantes elegia elegible elegibles elegida elegidas
elegido elegidos elegimos elegir elegira elegiria elegiste elemental elementales elemento elementos elenco eleva
elevacion elevada elevadas elevado elevador elevadores elevados elevan elevando elevar elevaron eleven elevo elfo elfos
eligen eliges eligiendo eligieron eligio elijan elijas elije elimina eliminacion eliminada eliminadas eliminado
eliminados eliminan eliminando eliminar eliminaron eliminatoria eliminatorias elimine eliminen elimino eliseo elite
elites elitista ella elle ello elocuencia elocuente elogiado elogio elogios eludir emana emancipacion embajada embajadas
embajador embajadora embajadores embalaje embalse embalses embarazada embarazadas embarazo embarazos embarcacion
embarcaciones embarcadero embarcado embarcar embarco embargo embarque emblema emblemas emblematica emblematico
emblematicos embole emboscada embotellada embrague embrion embriones embudo embutidos emerge emergen emergencia
emergencias emergente emergentes emerger emergio emerito emigracion emigrado emigrante emigrantes emigrar emigraron
emigro eminencia eminente eminentemente emir emiratos emisario emision emisiones emisor emisora emisoras emita emite
emiten emitida emitidas emitido emitidos emitiendo emitieron emitio emitir emocion emociona emocionada emocionado
emocionados emocional emocionales emocionalmente emocionante emocionantes emociones emociono emotiva emotivo empalme
empanada empanadas empapado empaque empatado empatados empatar empate empates empatia empato empece empecemos empeora
empeorado empeorando empeorar empeoro emperador emperadores emperatriz empero empezaba empezaban empezado empezamos
empezando empezar empezara empezaran empezare empezaremos empezaria empezaron empezaste empezo empiece empiecen empieces
empieza empiezan empiezas empiezo empirica emplazamiento emplea empleaba empleada empleadas empleado empleador
empleadores empleados emplean empleando emplear emplearon empleo empleos empobrecimiento empoderar emprende emprendedor
emprendedora emprendedores emprender emprendido emprendieron emprendio empresa empresaria empresariado empresarial
empresariales empresario empresarios empresas empuja empujado empujan empujando empujar empuje empujo empujon empujones
emular enajenacion enamora enamorada enamorado enamorados enamoramiento enamoran enamorar enamore enamoro enana enano
enanos encabeza encabezada encabezado encabezados encabezar encabezo encadenado encaja encajan encajar encaje
encaminadas encaminado encanta encantaba encantada encantado encantador encantadora encantadores encantados encantan
encantar encantara encantaria encanto encantos encapuchados encara encarar encarcelado encarcelados encarcelamiento
encarcelar encarga encargaba encargada encargadas encargado encargados encargamos encargan encargar encargara encargaron
encargo encargos encargue encarna encarnacion encarnado encender encendida encendidas encendido encendidos encendio
encerrada encerrado encerrados encerrar encerro enchufados enchufe enciclica enciclopedia enciende encienden encierra
encierran encierro encima encina encinas enclave enclaves encomendo encomienda encomiendas encontraba encontraban
encontrada encontradas encontrado encontrados encontramos encontrando encontrar encontrara encontraran encontraras
encontraremos encontraria encontrarian encontraron encontraste encontre encontremos encontro encrucijada encubierta
encubierto encubiertos encubrimiento encubrir encuentra encuentran encuentras encuentre encuentren encuentres encuentro
encuentros encuesta encuestados encuestas ende endemica enderezar endeudamiento enemiga enemigas enemigo enemigos
enemistad energetica energeticas energetico energeticos energia energias energica energicamente energico enero enesima
enfada enfadada enfadado enfado enfasis enfatiza enfatizar enfatizo enferma enfermar enfermas enfermedad enfermedades
enfermera enfermeras enfermeria enfermero enfermeros enfermiza enfermizo enfermo enfermos enfoca enfocada enfocadas
enfocado enfocados enfocan enfocar enfoque enfoques enfrenta enfrentaba enfrentaban enfrentado enfrentados
enfrentamiento enfrentamientos enfrentamos enfrentan enfrentando enfrentar enfrentara enfrentaran enfrentaron enfrente
enfrento enfria enfriamiento enfriar enfurece enfurecido engancha enganchado enganchar enganche engloba engordar
engranaje engranajes enhorabuena enigma enigmatico enjambre enjuiciamiento enjuiciar enlace enlaces enlaza enlazado
enlazar enloquecer enmarca enmarcada enmarcado enmarcar enmascarado enmendar enmienda enmiendas enoja enojada enojado
enojados enojan enojar enoje enojes enojo enorgullece enorme enormemente enormes enredo enrique enriquece enriquecen
enriquecer enriquecido enriquecimiento ensalada ensaladas ensamble ensanche ensayando ensayar ensayista ensayo ensayos
enseguida ensenada enseres enserio ensuciar entablar ente entendamos entendemos entender entendera entenderan entenderas
entendere entenderia entenderias entendes entendi entendia entendian entendible entendida entendido entendidos
entendiendo entendiera entendieron entendimiento entendimos entendio entendiste entera enterado enteramente enteramos
enteran enterar enteraron enteras entere enteren entero enteros enterrada enterradas enterrado enterrados enterrar entes
entidad entidades entienda entiendan entiendas entiende entienden entiendes entiendo entierro entonacion entonces
entorno entornos entorpecer entra entraba entraban entrada entradas entrado entramado entramos entran entrando entrante
entrar entrara entraran entraria entraron entras entraste entre entredicho entrega entregaba entregada entregadas
entregado entregados entregamos entregan entregando entregar entregara entregaran entregaron entregas entrego entregue
entreguen entremos entren entrena entrenado entrenador entrenadora entrenadores entrenados entrenamiento entrenamientos
entrenan entrenando entrenar entreno entrepierna entres entretanto entretener entretenida entretenido entretenidos
entretenimiento entretiene entrever entrevista entrevistado entrevistador entrevistados entrevistando entrevistar
entrevistas entrevisto entristece entro entusiasmada entusiasmado entusiasmo entusiasta entusiastas enumera enumerar
enunciado enunciados envase envases envejece envejecer envejecido envejecimiento envenenado envenenamiento envergadura
envia enviaba enviaban enviada enviadas enviado enviados enviamos envian enviando enviar enviara enviaran enviaremos
enviaron envias envidia envidiable envidio envie envien envio envios envoltorio envoltura envolver envuelta envuelto
envueltos envuelve enzima enzimas eolica eolico epica epicentro epico epidemia epidemias epidemiologia epidermis
epifania epilepsia epilogo episcopal episodio episodios epistola epoca epocas epopeya equidad equilibrada equilibrado
equilibrar equilibrio equipada equipadas equipado equipados equipaje equipamiento equipamientos equipar equiparar equipo
equipos equis equitativa equitativo equivale equivalen equivalencia equivalente equivalentes equivoca equivocacion
equivocada equivocadas equivocado equivocados equivocamos equivocan equivocar equivocaron equivocas equivocaste equivoco
equivoque eramos eran erario eras erase ereccion eres ergo erige erigido erigio erigir eritrea ermita eros erosion
erotica eroticas erotico eroticos erotismo errada erradicacion erradicar errado errante errar erronea erroneamente
erroneas erroneo error errores erudito eruditos erupcion erupciones esas esbozo escala escalada escalafon escalando
escalar escalas escalera escaleras escalofriante escalofrios escalon escalona escalones escamas escandalo escandalos
escandalosa escandaloso escandinavos escaneo escaner escapa escapaba escapada escapado escapan escapando escapar
escaparate escaparon escape escapo escarabajo escaramuzas escarlata escasa escasamente escasas escasez escaso escasos
escena escenario escenarios escenas escenica escenicas escenico escenografia escepticismo esceptico escepticos escision
esclarecer esclava esclavas esclavitud esclavo esclavos esclerosis escoba escobar escoces escocesa escoceses escocia
escoge escogen escoger escogi escogida escogido escogidos escogiendo escogieron escogio escoja escolar escolares
escolaridad escolta escoltas escombros esconde esconden esconder escondia escondida escondidas escondido escondidos
escondiendo escondio escondite escopeta escopetas escoria escorial escorpion escote escriba escriban escribano escribas
escribe escriben escribes escribi escribia escribian escribiendo escribiera escribieron escribimos escribio escribir
escribire escribiria escribiste escribo escrita escritas escrito escritor escritora escritoras escritores escritorio
escritos escritura escrituras escrupulos escrutinio escuadra escuadron escuadrones escucha escuchaba escuchaban
escuchada escuchadas escuchado escuchados escuchamos escuchan escuchando escuchar escuchara escucharon escuchas
escuchaste escuche escuchemos escuchen escuches escucho escudero escudo escudos escuela escuelas escultor escultores
escultura esculturas escupe escupir esencia esencial esenciales esencialmente esencias esfera esferas esfinge esforzado
esfuerza esfuerzan esfuerzo esfuerzos esgrima eslabon eslogan eslovaco esmalte esmeralda esmeraldas esmero esofago esos
espacial espaciales espacio espacios espada espadas espalda espaldas espanta espantar espanto espantosa espantosas
espantoso esparcidos esparcimiento esparcir esparta esparza especia especial especiales especialidad especialidades
especialista especialistas especializa especializacion especializada especializadas especializado especializados
especialmente especias especie especies especifica especificacion especificado especificamente especificar especificas
especificidad especifico especificos especimen especimenes espectacular espectaculares espectaculo espectaculos
espectador espectadores espectro espectros especula especulacion especulaciones especuladores especular espejismo espejo
espejos espeluznante espera esperaba esperabamos esperaban esperabas esperada esperado esperados esperamos esperan
esperando esperanto esperanza esperanzas esperar esperare esperaria esperaron esperas espere esperemos esperen esperes
esperma espermatozoides espero espesa espeso espesor espia espiando espiar espias espiga espina espinal espinar espinas
espino espinosa espinoso espionaje espiral espiritu espiritual espirituales espiritualidad espiritualmente espiritus
esplendida esplendido esplendor esponja espontanea espontaneamente espontaneas espontaneidad espontaneo esporas esposa
esposas esposo esposos espuma esqueleto esqueletos esquema esquemas esqui esquina esquinas esquiva esquivar
esquizofrenia esta estaba estabamos estaban estabas estabilidad estabilizacion estabilizar estable establece establecen
establecer establecera establecia establecida establecidas establecido establecidos estableciendo establecieron
establecimiento establecio estables establezca establezcan establo estaca estacion estacionado estacionados estacional
estacionales estacionamiento estacionar estaciones estad estadia estadio estadios estadista estadistica estadisticas
estadistico estadisticos estado estados estadounidense estadounidenses estafa estafador estafadores estafar estafas
estais estalla estallar estallido estallo estamentos estamos estampa estampado estampas estampillas estan estancada
estancado estancamiento estancia estancias estandar estandares estandarte estando estanque estanques estante estanteria
estanterias estantes estar estara estaran estaras estare estaremos estaria estariamos estarian estarias estas estatal
estatales estatica estatico estatua estatuas estatura estatus estatuto estatutos este esteban esteis estela estelar
estelares estemos esten estepa ester estereo estereotipo estereotipos esteril esteriles esterilizacion esterlinas estero
esteroides estes estetica esteticas estetico esteticos estiercol estigma estilista estilo estilos estima estimacion
estimaciones estimada estimado estimados estiman estimar estime estimo estimula estimulacion estimulan estimulando
estimulante estimulantes estimular estimulo estimulos estipula estipulado estira estirar estirpe estival esto estofado
estomago estonia estorbo estos estoy estrada estrado estragos estratega estrategia estrategias estrategica estrategicas
estrategico estrategicos estrato estratos estrecha estrechamente estrechar estrechas estrecho estrechos estrella
estrellado estrellas estrello estrena estrenada estrenado estrenar estrenara estreno estrenos estres estresado
estresante estrias estribillo estribos estricta estrictamente estrictas estricto estrictos estrofa estrofas estructura
estructuracion estructurada estructurado estructural estructurales estructurar estructuras estruendo estuche estudia
estudiaba estudiada estudiadas estudiado estudiados estudiamos estudian estudiando estudiante estudiantes estudiantil
estudiantiles estudiar estudiaron estudias estudiaste estudie estudien estudio estudios estudioso estudiosos estufa
estupefacientes estupenda estupendo estupendos estupida estupidas estupideces estupidez estupido estupidos estuve
estuviera estuvieramos estuvieran estuvieras estuvieron estuviese estuviesen estuvimos estuviste estuvo etanol etapa
etapas etcetera eter eterna eternamente eternas eternidad eterno eternos etica eticas etico eticos etimologia etiope
etiopia etiqueta etiquetado etiquetar etiquetas etnia etnias etnica etnicas etnico etnicos eucaristia eufemismo euforia
euro europea europeas europeo europeos euros eurovision eutanasia evacuacion evacuado evacuados evacuar evadir evalua
evaluacion evaluaciones evaluado evaluados evaluan evaluando evaluar evangelica evangelico evangelicos evangelio
evangelios evangelista evangelistas evangelizacion evaporacion evasion evento eventos eventual eventuales eventualidad
eventualmente evidencia evidencian evidenciar evidencias evidente evidentemente evidentes evitado evitamos evitan
evitando evitar evitara evitaria evite eviten evito evoca evolucion evoluciona evolucionado evolucionan evolucionando
evolucionar evoluciono evolutiva evolutivo exacta exactamente exactas exactitud exacto exactos exagera exageracion
exagerada exageradamente exageradas exagerado exagerados exagerando exagerar exaltacion examen examenes examina
examinado examinando examinar examino excavacion excavaciones excavar exceda excede exceden excedente excedentes exceder
excelencia excelente excelentes excentrico excepcion excepcional excepcionales excepciones excepto exceptuando excesiva
excesivamente excesivas excesivo excesivos exceso excesos excita excitacion excitado excitante exclamo excluida
excluidas excluido excluidos excluir exclusion exclusiva exclusivamente exclusivas exclusividad exclusivo exclusivos
excluye excluyen excluyendo excluyente excluyentes excrementos excursion excursiones excusa excusas exencion exenciones
exenta exentas exento exentos exhaustiva exhaustivo exhibe exhiben exhibicion exhibiciones exhibido exhibio exhibir
exhorta exhorto exige exigen exigencia exigencias exigente exigentes exigia exigian exigido exigidos exigiendo exigieron
exigimos exigio exigir exigira exijan exiliado exiliados exilio exime exista existan existe existen existencia
existencial existencias existente existentes existes existia existian existido existiendo existiera existieran
existieron existimos existio existir existira existiria existo exito exitos exitosa exitosamente exitosas exitoso
exitosos exodo exotica exoticas exotico exoticos expande expandido expandiendo expandio expandir expansion expansiones
expansiva expatriados expectacion expectativa expectativas expedicion expediciones expedida expedido expediente
expedientes expensas experiencia experiencias experimenta experimentacion experimentada experimentado experimentados
experimental experimentales experimentan experimentando experimentar experimentaron experimento experimentos experta
experto expertos expiatorio explanada explica explicaba explicacion explicaciones explicada explicado explicamos
explican explicando explicar explicara explicaria explicaron explicas explicita explicitamente explicitas explicito
explico explique expliquen explora exploracion exploraciones explorado explorador exploradores explorando explorar
explosion explosiones explosiva explosivas explosivo explosivos explota explotacion explotaciones explotada explotadas
explotado explotados explotan explotando explotar explote exploto expone exponen exponencial exponente exponentes
exponer exponiendo exporta exportacion exportaciones exportado exportador exportadores exportar exposicion exposiciones
expositores expres expresa expresaba expresada expresadas expresado expresados expresamente expresamos expresan
expresando expresar expresaron expresas exprese expresen expresion expresiones expresiva expresivo expreso expropiacion
expropiaciones expuesta expuestas expuesto expuestos expulsa expulsada expulsado expulsados expulsar expulsaron
expulsion expulso expusieron expuso exquisita exquisito extasis extender extendera extendia extendida extendidas
extendido extendidos extendiendo extendieron extendio extensa extensamente extensas extension extensiones extensiva
extensivo extenso extensos exterior exteriores exterminar exterminio externa externas externo externos extienda extiende
extienden extincion extinguido extinguir extinto extorsion extraccion extracto extractos extradicion extrae extraen
extraer extraida extraido extraidos extranjera extranjeras extranjero extranjeros extraordinaria extraordinarias
extraordinario extraordinarios extras extraterrestre extraterrestres extravagante extravagantes extraviado extrema
extremadamente extremas extremidad extremidades extremismo extremista extremistas extremo extremos exuberante fabrica
fabricacion fabricada fabricadas fabricado fabricados fabrican fabricando fabricante fabricantes fabricar fabricas
fabula fabulas fabulosa fabuloso fabulosos faccion facciones faceta facetas facha fachada fachadas fachas facial
faciales facil faciles facilidad facilidades facilita facilitado facilitan facilitando facilitar facilitara facilite
faciliten facilito facilmente factibilidad factible factor factores factoria factura facturacion facturas facultad
facultades facundo faena faja fajardo falacia falange falcon falda faldas falla fallado fallamos fallan fallando fallar
fallaron fallas fallaste falle fallece fallecer fallecida fallecido fallecieron fallecimiento fallecio fallen fallida
fallido fallidos fallo fallos falsa falsamente falsas false falsedad falsedades falsificacion falsificar falso falsos
falta faltaba faltaban faltado faltan faltando faltar faltara faltaria faltaron faltas falte falten falto fama familia
familiar familiares familiaridad familiarizado familiarizados familias famosa famosas famoso famosos fanatica fanatico
fanaticos fanatismo fango fantasia fantasias fantasma fantasmas fantastica fantasticas fantastico fantasticos farandula
faraon farias farmaceutica farmaceuticas farmaceutico farmaceuticos farmacia farmacias farmaco farmacos faro farol faros
farsa farsante fascina fascinacion fascinado fascinante fascinantes fascismo fascista fascistas fase fases faso fastidia
fastidio fatal fatales fatiga fauna fausto favor favorable favorablemente favorables favorece favorecen favorecer
favorecido favorecidos favoreciendo favorecio favores favorita favoritas favoritismo favorito favoritos feas febrero
fecha fechada fechado fechas fecundacion federacion federaciones federal federales federalismo federativa federico
felices feliciano felicidad felicidades felicita felicitacion felicitaciones felicitar felicito feligreses felino
felinos felipe feliz felizmente femenil femenina femeninas femenino femeninos feminismo feminista feministas fenix
fenomenal fenomeno fenomenos feos feria feriado feriados ferias fermentacion feroces feroz ferrea ferreteria ferrocarril
ferrocarriles ferroviaria ferroviarias ferroviario ferroviarios fertil fertiles fertilidad fertilizacion fertilizante
fertilizantes ferviente fervor festeja festejan festejando festejar festejo festejos festin festiva festival festivales
festividad festividades festivo festivos fetal fetiche feto fetos feudal feudales feudalismo feudo fiabilidad fiable
fiables fianza fiar fiasco fiat fibra fibras ficcion ficciones ficha fichado fichaje fichajes fichar fichas fichero
ficheros ficticia ficticio ficticios fideicomiso fidelidad fideos fiebre fiel fieles fielmente fiera fieras fiero fierro
fiesta fiestas fifa figura figuraba figuraban figuran figurar figuras figure fija fijacion fijada fijado fijados
fijamente fijamos fijan fijando fijar fijaron fijas fije fijo fijos fila filadelfia filamentos filarmonica filas file
files filete filetes filiacion filial filiales filipina filipinas filipino filipinos film filma filmacion filmada
filmado filmando filmar filme filmes filmo filo filologia filosofia filosofica filosoficas filosofico filosoficos
filosofo filosofos filtra filtracion filtraciones filtrado filtran filtrar filtro filtros fina final finales finalidad
finalidades finalista finalistas finaliza finalizacion finalizada finalizado finalizando finalizar finalizo finalmente
finamente financia financiacion financiada financiadas financiado financiados financiamiento financian financiando
financiar financiera financieras financiero financieros financio finanzas finas finca fincas fine fines finge fingiendo
fingir finita finito finlandes fino finos firma firmaba firmada firmadas firmado firmados firmamos firman firmando
firmantes firmar firmara firmaron firmas firme firmemente firmen firmes firmeza firmo fiscal fiscales fiscalia
fiscalizacion fiscalizar fisco fisica fisicamente fisicas fisico fisicos fisiologia fisura fisuras fito flaca flacas
flaco flacos flagelo flagrante flamante flamenca flamenco flamencos flan flanco flancos flauta flautas flecha flechas
flete flexibilidad flexible flexibles flexion floja flojera flojo flojos flor flora floracion floral florales florece
florecen florecer floreciente florecimiento florentino flores floresta florida florido flota flotacion flotando flotante
flotantes flotar flotas flote flotilla fluctuaciones fluida fluidez fluido fluidos fluir flujo flujos fluvial fluviales
fluya fluyen fobia foca focal focas foco focos fogata folclore folio folios folleto folletos fomenta fomentan fomentando
fomentar fomento fonda fondo fondos fonetica fontana foraneos forastero forasteros forense forenses forestal forestales
forja forjado forjar forma formaba formaban formacion formaciones formada formadas formado formados formal formales
formalidad formalidades formalizacion formalizar formalmente formamos forman formando formar formara formaran formaron
formas formativo formato formatos forme formen formidable formo formula formulacion formulada formuladas formulado
formular formulario formularios formulas formulo foro foros forra forrado forro forros fortalece fortalecen fortalecer
fortalecido fortaleciendo fortalecimiento fortaleza fortalezas fortificaciones fortin fortuito fortuna fortunas forza
forzada forzadas forzado forzados forzando forzar forzaron forzo forzosa forzosamente forzoso fosa fosas fosfato fosforo
fosil fosiles foso foto fotocopia fotocopias fotografa fotografia fotografiado fotografiar fotografias fotografica
fotograficas fotografico fotograficos fotografo fotografos fotos fracasa fracasada fracasado fracasados fracasan
fracasar fracasaron fracaso fracasos fraccion fraccionamiento fracciones fractura fracturas fraga fragancia fragata
fragil fragiles fragilidad fragmentacion fragmento fragmentos fraile frailes franca francamente frances francesa
francesas franceses francisca franciscana franciscano franciscanos francisco franco francos francotirador
francotiradores franja franjas franqueza franquicia franquicias franquismo franquista franquistas frasco frascos frase
frases fraternal fraternidad fraude fraudes fraudulenta fraudulentas fraudulento fray frecuencia frecuencias frecuente
frecuentemente frecuentes fregadero frei freir freire frena frenado frenar frenesi frenetico freno frenos frente frentes
fresa fresas fresca frescas fresco frescos frescura fresno fria frialdad frias friccion frigorifico frijol frijoles frio
frios frita fritas frito fritos frontal frontales frontera fronteras fronteriza fronterizas fronterizo fronterizos
fructifera frustracion frustraciones frustrada frustrado frustrados frustrante fruta frutales frutas fruto frutos fuego
fuegos fuel fuente fuentes fuera fueramos fueran fueras fuere fuero fueron fueros fuerte fuertemente fuertes fuerza
fuerzas fuese fuesemos fuesen fueses fuga fugas fugaz fugitivo fugitivos fuimos fuiste fulano fuma fumaba fumado fumador
fumadores fuman fumando fumar fumas fume fumo funcion funciona funcionaba funcionaban funcionado funcional funcionales
funcionalidad funcionalidades funcionamiento funcionan funcionando funcionar funcionara funcionaria funcionario
funcionarios funcionaron funcione funcionen funciones funciono funda fundacion fundacional fundaciones fundada fundadas
fundado fundador fundadora fundadores fundados fundamenta fundamental fundamentales fundamento fundamentos fundan fundar
fundaron fundas funde funden fundicion fundido fundir fundo funebre funeral funerales funeraria funerario funerarios
furgoneta furia furiosa furioso furiosos furor fusil fusilado fusilados fusilamiento fusiles fusion fusiones futbol
futbolista futbolistas futbolistica futbolistico futura futuras futurista futuro futuros gabinete gabinetes gaceta gafas
gaga gago gala galactico galan galapagos galardon galardonada galardonado galardonados galardones galas galaxia galaxias
galera galeras galeria galerias galilea galileo galindo gallardo gallega gallegas gallego gallegos galleta galletas
gallina gallinas gallinero gallo gallos galo galon galones galpon gama gamarra gamba gambas gamboa gamma gana ganaba
ganaban ganada ganadas ganadera ganaderas ganaderia ganadero ganaderos ganado ganador ganadora ganadoras ganadores
ganados ganamos ganan ganancia ganancias ganando ganar ganara ganaran ganaremos ganaria ganaron ganas ganaste gancho
ganchos gane ganemos ganen ganes gang ganga gano ganso garaje garante garantia garantias garantice garanticen garantiza
garantizada garantizado garantizados garantizan garantizando garantizar garantizo garbanzos garcia garganta gargantas
garra garras garrido garrote garza garzon gasa gaseosa gaseosas gases gasoducto gasolina gasolinera gasolineras gasta
gastado gastados gastamos gastan gastando gastar gastaron gastas gaste gastes gasto gastos gastronomia gastronomica
gastronomico gata gatillo gato gatos gaucho gauchos gaviota gaviotas gaza gelatina gema gemas gemela gemelas gemelo
gemelos gemidos gendarmeria gendarmes genealogia genealogico genera generaba generacion generacional generaciones
generada generadas generado generador generadores generados general generales generalidad generalidades generalisimo
generalizacion generalizada generalizado generalizar generalmente generan generando generar generara generaron genere
generen generica generico genericos genero generos generosa generosamente generosas generosidad generoso generosos genes
genesis genetica geneticas genetico geneticos genial geniales genialidad genio genios genital genitales genocida
genocidas genocidio genoma gente gentes gentil gentiles gentileza gentuza genuina genuino geografia geografica
geograficamente geograficas geografico geograficos geologia geologica geologico geologicos geometria geometrica
geometricas geopolitica georgiana georgiano gerencia gerente gerentes german germanico germano germen germenes gesta
gestacion gestion gestiona gestionada gestionado gestionar gestiones gesto gestor gestora gestores gestos gigante
gigantes gigantesca gigantesco gilada gilbert gimnasia gimnasio gimnasios gimnasta ginebra ginecologo gira giraba girado
giran girando girar giras girasol giratoria gire giro giros gitana gitano gitanos glaciar glaciares gladiadores glamour
glandula glandulas global globales globalizacion globalizado globo globos globulos gloria glorias glorieta gloriosa
glorioso gloriosos glosario glucosa gluten gluteos gobernaba gobernabilidad gobernacion gobernaciones gobernada
gobernado gobernador gobernadora gobernadores gobernados gobernando gobernante gobernantes gobernanza gobernar goberno
gobierna gobiernan gobierne gobierno gobiernos goce godos goleada goleador goles goleta golf golfo golosinas golpe
golpea golpeaba golpeada golpeado golpeados golpean golpeando golpear golpearon golpeo golpes golpista golpistas golpiza
goma gomas gong gorda gordas gordo gordos gorila gorilas gorra gorras gorro gota gotas goteo gotica gotico gourmet goya
goza gozaba gozado gozan gozando gozar gozo graba grabacion grabaciones grabada grabadas grabado grabador grabadora
grabados graban grabando grabar grabaron grabo gracia gracias graciosa graciosas gracioso graciosos grada gradas grado
grados graduacion graduada graduado graduados gradual gradualmente gradue graduo grafica graficas grafico graficos
gramatica gramatical gramaticales gramo gramos gran granada granadas granaderos granados granate grande grandemente
grandes grandeza grandiosa grandioso grandiosos granel granero granito granizo granja granjas granjero granjeros grano
granos grasa grasas grasos grata gratificante gratis gratitud grato gratuidad gratuita gratuitamente gratuitas gratuito
gratuitos grava gravar grave gravedad gravemente graves gray gremial gremiales gremio gremios grey griega griegas griego
griegos grieta grietas grifo grillo grillos gringa gringas gringo gringos gripe gris grises grita gritaba gritaban
gritado gritan gritando gritar gritaron gritas grite griten grito gritos grosera groseria groserias grosero groseros
groso grosor grotesco grua gruas gruesa gruesas grueso gruesos grupal grupales grupo grupos gruta guagua guaira guajira
guante guantes guapa guapas guapo guapos guarani guaranies guarda guardaba guardada guardadas guardado guardados
guardaespaldas guardamos guardan guardando guardar guardas guarde guarden guarderia guarderias guardia guardian
guardianes guardias guardo guarida guarnicion guarniciones guatemalteca guatemalteco guatemaltecos guau guay guayaquil
guayas gubernamental gubernamentales guerra guerras guerrera guerreras guerrero guerreros guerrilla guerrillas
guerrillero guerrilleros gueto guia guiada guiadas guiado guiados guian guiando guiar guias guie guillen guillotina
guinea guio guion guiones guionista guionistas guiso guisos guita guitarra guitarras guitarrista guru gusano gusanos
gusta gustaba gustaban gustado gustan gustando gustar gustara gustaria gustaron gustas guste gusten gustes gusto gustos
guzman habana habas habeis haber habia habiamos habian habias habida habido habiendo habil habiles habilidad habilidades
habilita habilitacion habilitada habilitado habilitados habilitar habita habitaban habitable habitacion habitaciones
habitada habitadas habitado habitan habitante habitantes habitar habitat habitats habito habitos habitual habituales
habitualmente habla hablaba hablabamos hablaban hablabas hablada hablado hablamos hablan hablando hablante hablantes
hablar hablara hablaran hablare hablaremos hablaria hablaron hablas hablaste hable hablemos hablen hables hablo habra
habran habras habre habremos habria habriamos habrian habrias hace haced haceis hacemos hacen hacer haces hacha hachas
hacia haciamos hacian hacias hacienda haciendas haciendo hacinamiento hada hadas haga hagais hagamos hagan hagas hago
haitiana haitiano haitianos hala halago halagos halcon halcones hale hall halla hallaba hallaban hallada hallado
hallados hallamos hallan hallar hallaron hallazgo hallazgos halle hallo halo hamaca hambre hambriento hambrientos
hambruna hamburguesa hamburguesas hampa hangar hara haran haras hare haremos haria hariamos harian harias harina harinas
harta harto hartos hato haya hayais hayamos hayan hayas hebrea hebreo hebreos hecha hechas hechicera hechicero hechizo
hechizos hecho hechos hectarea hectareas hedor hegemonia helada heladas heladera helado helados helena helice
helicoptero helicopteros helio hembra hembras hemeroteca hemisferio hemoglobina hemorragia hemorragias hemorroides hemos
henares heno hepatica hepatitis heraldo hercules hereda heredada heredado heredar heredera heredero herederos
hereditaria hereditario heredo hereje herejes herejia herencia herencias herida heridas herido heridos herir hermana
hermanas hermandad hermandades hermano hermanos hermosa hermosas hermoso hermosos hermosura hernia herodes heroe heroes
heroica heroico heroismo herpes herradura herramienta herramientas herrera herrero herreros hervir hibrida hibrido
hibridos hice hiciera hicieramos hicieran hicieras hicieron hiciese hicimos hiciste hidalgo hidraulica hidraulicas
hidraulico hidraulicos hidricos hidrocarburos hidroelectrica hidroelectricas hidrogeno hielo hielos hierba hierbas
hieren hierro hierve higado higiene higienico higos higuera hija hijas hijo hijos hilarante hilera hileras hilo hilos
himno himnos hincapie hincha hinchada hinchado hinchados hinchas hinchazon hindi hindues hiper hipertension hipnosis
hipo hipocresia hipocrita hipocritas hipodromo hipoteca hipotecaria hipotecario hipotecarios hipotecas hipotesis
hipotetica hipotetico hippie hiriendo hirieron hirviendo hispana hispanica hispano hispanos histeria histerica historia
historiador historiadores historial historias historica historicamente historicas historico historicos historieta
historietas historiografia hito hitos hizo hocico hogar hogares hoguera hogueras hoja hojas hola holanda holandes
holandesa holandeses holding holocausto hombre hombres hombro hombros home homenaje homenajear homenajes homeopatia
homicida homicidio homicidios homofobia homofobico homogenea homogeneo homologo homologos homonimo honda hondo honduras
honesta honestamente honestas honestidad honesto honestos hongo hongos honor honorable honorables honorario honorarios
honores honra honrada honradez honrado honrados honrar hope hora horaria horario horarios horas horca horda hordas
horizontal horizontales horizonte horizontes hormiga hormigas hormigon hormiguero hormona hormonal hormonales hormonas
horno hornos horoscopo horrenda horrendo horrible horriblemente horribles horror horrores horroroso hortalizas hospedaje
hospicio hospital hospitalaria hospitalario hospitalarios hospitales hospitalidad hospitalizacion hospitalizado hostal
hosteleria hostia hostias hostigamiento hostil hostiles hostilidad hostilidades hotel hotelera hoteles hoya hoyo hoyos
hubiera hubieramos hubieran hubieras hubiere hubieron hubiese hubiesemos hubiesen hubieses hubo hueca hueco huecos huela
huelen huelga huelgas huella huellas huelo huerfana huerfano huerfanos huerta huertas huerto huertos hueso huesos
huesped huespedes huestes huevo huevos huian huida huido huila huir hule human humana humanas humanidad humanidades
humanismo humanista humanistas humanitaria humanitarias humanitario humanitarios humano humanos humeda humedad humedales
humedas humedo humedos humildad humilde humildemente humildes humillacion humillaciones humillado humillante humillar
humo humor humorista humoristico humos hunde hunden hundido hundidos hundiendo hundimiento hundio hundir hungara hungaro
hungaros huracan huracanes hurtado hurto huye huyen huyendo huyeron huyo ibamos iban ibas iberia iberica iberico ibero
iberoamericana iberoamericano iceberg iconica iconico icono iconografia iconos idas idea ideado ideal ideales idealismo
idealista idealmente idear ideario ideas idem identica identicas identico identicos identidad identidades identifica
identificacion identificada identificadas identificado identificador identificados identifican identificando identificar
identificaron identifico identifique ideo ideologia ideologias ideologica ideologicas ideologico ideologicos idioma
idiomas idiosincrasia idiota idiotas idioteces idiotez idolo idolos idonea idoneidad idoneo iglesia iglesias ignora
ignoraba ignorada ignorado ignorados ignoramos ignoran ignorancia ignorando ignorante ignorantes ignorar ignoras ignore
ignoro igual iguala igualar igualdad iguales igualitaria igualitario igualmente iguana ilegal ilegales ilegalidad
ilegalmente ilegitima ilegitimo ilicita ilicitas ilicito ilicitos ilimitada ilimitado ilimitados ilogico ilumina
iluminacion iluminada iluminado iluminados iluminan iluminar ilusion ilusionado ilusiones iluso ilustra ilustracion
ilustraciones ilustrada ilustrado ilustrador ilustrados ilustran ilustrar ilustrativo ilustre ilustres imagen imagenes
imagina imaginaba imaginacion imaginado imaginamos imaginan imaginando imaginar imaginaria imaginario imaginarios
imaginas imagine imaginemos imaginen imagino iman imanes imbecil imbeciles imita imitacion imitaciones imitan imitando
imitar impaciencia impaciente impacta impactado impactante impactantes impactar impacto impactos impar imparable
imparcial imparciales imparcialidad imparte imparten impartido impartir impecable impedia impedido impedimento
impedimentos impedir impedira impenetrable impensable impera imperante imperativo imperdonable imperfecciones imperfecta
imperfecto imperial imperiales imperialismo imperialista imperialistas imperio imperios impermeable impetu impida
impidan impide impiden impidiendo impidieron impidio implacable implantacion implantado implantar implante implantes
implementa implementacion implementada implementadas implementado implementando implementar implemento implica implicaba
implicacion implicaciones implicada implicadas implicado implicados implican implicando implicar implicaria implicita
implicitamente implicito implico implique impondra impone imponen imponente imponer imponga impongan imponible
imponiendo impopular importa importaba importacion importaciones importada importadas importado importador importadores
importados importamos importan importancia importando importante importantes importar importara importaria importas
importe importes importo imposibilidad imposible imposibles imposicion imposiciones impositiva impositivo impostor
impotencia impotente impredecible imprenta impresa impresas imprescindible imprescindibles impresentable impresion
impresiona impresionada impresionado impresionados impresionante impresionantes impresionar impresiones impresiono
impreso impresora impresoras impresos imprevisto imprevistos imprime imprimen imprimio imprimir improbable impronta
impropio improvisacion improvisada improvisado improvisados improvisar imprudencia imprudente impuesta impuestas
impuesto impuestos impugnacion impugnar impulsa impulsada impulsadas impulsado impulsados impulsan impulsando impulsar
impulsaron impulse impulsivo impulso impulsor impulsores impulsos impune impunemente impunes impunidad impurezas
impusieron impuso imputacion imputado imputados inaccesible inaccesibles inaccion inaceptable inactividad inactivo
inadecuada inadecuado inadmisible inagotable inalambrica inalambrico inalcanzable inapropiado inaudito inaugura
inauguracion inaugurada inaugurado inaugural inaugurar inauguro inca incalculable incansable incansablemente incapaces
incapacidad incapaz incas incendiado incendiar incendio incendios incentivar incentivo incentivos incertidumbre
incertidumbres incesante incesto incide inciden incidencia incidencias incidente incidentes incidir incienso incierta
incierto incipiente incision inciso incita incitacion incitar inclina inclinacion inclinaciones inclinada inclinado
inclino incluia incluian incluida incluidas incluido incluidos incluir incluira incluiria inclusion inclusiva inclusive
inclusivo incluso incluya incluyan incluye incluyen incluyendo incluyeron incluyo incognita incognito incoherencia
incoherente incomoda incomodas incomodidad incomodo incomodos incomparable incompatible incompatibles incompetencia
incompetente incompetentes incompleta incompleto incomprensible inconcebible incondicional incondicionales inconformidad
inconfundible inconsciente inconscientes inconsistencias incontables incontrolable inconveniente inconvenientes
incorpora incorporacion incorporada incorporadas incorporado incorporados incorporan incorporando incorporar
incorporaron incorporo incorrecta incorrectamente incorrectas incorrecto incredulidad increible increiblemente
increibles incrementa incrementado incrementan incrementando incrementar incrementaron incremento incrementos incubacion
incuestionable inculcar incumbe incumplimiento incumplir incurrir incursion incursiones indagacion indagar indagatoria
indebida indebidamente indebido indecente indeciso indecisos indefensa indefenso indefensos indefinida indefinidamente
indefinido indemnizacion indemnizaciones indemnizar independencia independentismo independentista independiente
independientes indescriptible indeseable indeseables indestructible indeterminado indiana indias indica indicaba
indicaban indicacion indicaciones indicada indicadas indicado indicador indicadores indicados indican indicando indicar
indicaron indicativo indice indices indicio indicios indico indiferencia indiferente indiferentes indigena indigenas
indigencia indigente indigentes indigna indignacion indignada indignado indignados indigno indios indique indirecta
indirectamente indirectas indirecto indirectos indiscriminada indiscutible indispensable indispensables indistintamente
individual individuales individualidad individualismo individualista individualmente individuo individuos indo
indocumentados indole indomable indonesia induccion induce inducida inducido inducir indudable indudablemente
indulgencia indulto indumentaria industria industrial industriales industrias inedita ineditas inedito ineditos
ineficacia ineficaz ineficiencia ineficiente ineludible ineptitud inepto ineptos inequivoca inercia inerte inesperada
inesperadamente inesperadas inesperado inesperados inestabilidad inestable inestables inestimable inevitable
inevitablemente inevitables inexistencia inexistente inexistentes inexplicable inexplicables infalible infame infames
infamia infancia infanta infante infanteria infantes infantil infantiles infarto infeccion infecciones infecciosas
infectada infectadas infectado infectados infelices infelicidad infeliz inferior inferiores inferioridad inferir
infernal infidelidad infiel infieles infierno infiernos infiltracion infiltrado infiltrados infinidad infinita
infinitamente infinitas infinito infinitos inflacion inflamacion inflexible inflexion influencia influenciada
influenciado influenciados influenciar influencias influenza influido influir influjo influye influyen influyente
influyentes influyeron influyo infografia informa informaba informacion informaciones informada informadas informado
informados informal informales informalidad informamos informan informando informante informantes informar informara
informaron informatica informaticas informatico informaticos informativa informativas informativo informativos informe
informen informes informo infraccion infracciones infractor infractores infraestructura infringido infusion ingeniera
ingenieria ingeniero ingenieros ingenio ingeniosa ingenioso ingente ingenua ingenuidad ingenuo ingenuos ingerir ingesta
ingestion ingles inglesa inglesas ingleses ingrediente ingredientes ingresa ingresado ingresan ingresando ingresar
ingresaron ingrese ingreso ingresos inhabilitacion inhabilitado inherente inherentes inhibe inhibicion inhibidores
inhumana inhumano inhumanos inicia iniciaba iniciacion iniciada iniciadas iniciado iniciados inicial iniciales
inicialmente iniciamos inician iniciando iniciar iniciara iniciaron iniciativa iniciativas inicie inicien inicio inicios
iniesta inigualable inimaginable ininterrumpida injerencia injerto injurias injusta injustamente injustas injusticia
injusticias injustificada injustificado injusto injustos inmaculada inmaduro inmaterial inmediaciones inmediata
inmediatamente inmediatas inmediato inmediatos inmensa inmensamente inmensas inmensidad inmenso inmensos inmersion
inmerso inmersos inmigracion inmigrante inmigrantes inminente inmobiliaria inmobiliarias inmobiliario inmobiliarios
inmoral inmorales inmoralidad inmortal inmortales inmortalidad inmovil inmueble inmuebles inmundo inmune inmunes
inmunidad inmunologico innata innato innecesaria innecesarias innecesario innecesarios innegable innovacion innovaciones
innovador innovadora innovadoras innovadores innovar innumerables inocencia inocente inocentes inodoro inofensiva
inofensivo inolvidable inolvidables inoxidable inquebrantable inquieta inquietante inquieto inquietud inquietudes
inquilino inquilinos inquisicion inquisidor insaciable insatisfaccion inscribe inscribio inscribir inscripcion
inscripciones inscrita inscritas inscrito inscritos insecto insectos insegura inseguridad inseguridades inseguro
inseguros insensible inseparable inseparables insercion inserta insertar inservible insigne insignia insignias
insignificante insignificantes insinua insinuaciones insinuando insinuar insiste insisten insistencia insistente
insistia insistido insistiendo insistimos insistio insistir insisto insolente insolita insolito insomnio insoportable
insoportables insostenible inspeccion inspeccionar inspecciones inspector inspectores inspira inspiracion inspirada
inspiradas inspirado inspirador inspiradora inspirados inspiran inspirar inspiraron inspire inspiro insta instala
instalacion instalaciones instalada instaladas instalado instalados instalan instalando instalar instalaron instale
instalo instancia instancias instantanea instantaneas instantaneo instante instantes instauracion instaurado instaurar
instinto instintos institucion institucional institucionales instituciones instituto institutos insto instruccion
instrucciones instructivo instructor instructores instruido instruir instrumentacion instrumental instrumentales
instrumento instrumentos insuficiencia insuficiente insuficientes insular insulares insulina insulta insultado insultan
insultando insultante insultar insulto insultos insumos insuperable insurgencia insurgente insurgentes insurreccion
intacta intactas intacto intactos intangible integra integracion integrada integradas integrado integrados integral
integrales integramente integran integrando integrante integrantes integrar integridad integro intelecto intelectual
intelectuales inteligencia inteligente inteligentes intemperie intencion intencionada intencionado intencional
intencionalidad intenciones intendencia intendente intendentes intensa intensamente intensas intensidad intensifica
intensificacion intensificar intensifico intensiva intensivo intensivos intenso intensos intenta intentaba intentaban
intentado intentamos intentan intentando intentar intentara intentaran intentare intentaremos intentaria intentaron
intentas intente intentemos intenten intentes intento intentos interaccion interacciones interactiva interactivas
interactivo interactivos interamericana interamericano intercambian intercambiar intercambio intercambios interceptado
interceptar interconexion interes interesa interesaba interesada interesadas interesado interesados interesan
interesante interesantes interesar interesaria interese interesen intereses intereso interfaces interfaz interferencia
interferencias interferir interfiere interino interior interiores interlocutor interlocutores intermedia intermediacion
intermediario intermediarios intermedias intermedio intermedios interminable interminables intermitente intermitentes
interna internacional internacionales internada internado internados internamente internas interno internos
interpersonales interpone interponer interpreta interpretacion interpretada interpretadas interpretado interpretados
interpretan interpretando interpretar interpretaron interprete interpretes interpreto interpuesta interpuesto interpuso
interrogacion interrogado interrogante interrogantes interrogar interrogatorio interrogatorios interrumpe interrumpida
interrumpido interrumpiendo interrumpio interrumpir interrupcion interrupciones interruptor interseccion intervalo
intervalos intervencion intervenciones intervenga intervenido intervenir interventor interviene intervienen
interviniendo intervinieron intervino intestinal intestinales intestino intestinos inti intima intimamente intimas
intimidacion intimidad intimidar intimo intimos intocable intocables intolerable intolerancia intolerante intolerantes
intoxicacion intransigente intravenosa intriga intrigante intrigas intrinseca intrinsecamente intrinseco introduccion
introduce introducen introducida introducidas introducido introducidos introduciendo introducir introdujeron introdujo
intromision introspeccion intrusion intruso intrusos intuicion intuitiva intuitivo inunda inundacion inundaciones
inundada inundado inundar inundo inusual inusuales inutil inutiles inutilidad invade invaden invadida invadido
invadiendo invadieron invadio invadir invalidez invalido invariablemente invasion invasiones invasor invasores
invencible invencion invenciones inventa inventada inventado inventados inventan inventando inventar inventario
inventarios inventaron invento inventor inventores inventos invernadero invernal inverosimil inversa inversion
inversiones inversionista inversionistas inverso inversor inversores invertida invertido invertidos invertir investido
investidura investiga investigacion investigaciones investigada investigado investigador investigadora investigadores
investigados investigan investigando investigar investigo investigue investiguen inviable invicto invierno inviernos
invierta invierte invierten invirtiendo invirtieron invirtio invisible invisibles invita invitaba invitacion
invitaciones invitada invitadas invitado invitados invitamos invitan invitando invitar invitaron invitas invite invito
invoca invocacion invocando invocar involucra involucrada involucradas involucrado involucrados involucran involucrar
involucre involucro involuntario inyeccion inyecciones inyectar iones iran iranies iraqui iraquies iras iremos iria
irian irias iris irlanda irlandes irlandesa irlandeses ironia ironica ironicamente ironico irracional irracionales
irreal irrefutable irregular irregulares irregularidad irregularidades irrelevante irrelevantes irreparable irresistible
irrespetuoso irresponsable irresponsables irreverente irreversible irrigacion irrita irritacion irritado irritante
irrumpe irrumpio irrupcion isabela isidro isla islamica islamico islamicos islamistas islas israeli israelies israelita
israelitas istmo italiana italianas italiano italianos item items itinerante itinerario itinerarios izquierda izquierdas
izquierdista izquierdistas izquierdo jabali jabon jabones jaca jacinto jacuzzi jade jaen jaguar jaguares jala jalar
jamon jane japones japonesa japonesas japoneses jaque jara jarabe jardin jardineria jardinero jardines jarra jaula
jaulas java jazmin jazz jefa jefatura jefe jefes jengibre jeque jerarquia jerarquias jerarquica jerarquico jeremias
jerez jerga jeronimo jersey jesuita jesuitas jeta jinete jinetes jirafa joda jodan jodas jode joden jodes jodida jodidas
jodido jodidos jodiendo jodio jordan jornada jornadas jornal jornaleros josefina jota joven jovenes joya joyas joyeria
juanes jubilacion jubilaciones jubilado jubilados jubilo judaismo judias judicatura judicial judiciales judicialmente
judios judo jueces juega juegan juegas juego juegos juegue jueguen juegues jueves juez jueza jugaba jugaban jugada
jugadas jugado jugador jugadora jugadoras jugadores jugados jugamos jugando jugar jugara jugaran jugaria jugaron jugaste
jugo jugos jugosa jugoso juguemos juguete juguetes juicio juicios juliana julio jungla junio junior junta juntada
juntado juntamos juntan juntando juntar juntaron juntas junte junten junto juntos jupiter jura jurada jurado jurados
juramento juran jurar jure juridica juridicamente juridicas juridico juridicos jurisdiccion jurisdiccional
jurisdicciones jurisprudencia jurista juristas juro justa justamente justas justicia justicialista justiciero justifica
justificacion justificaciones justificada justificadas justificado justificados justifican justificando justificar
justifico justifique justo justos juvenil juveniles juventud juventudes juzga juzgada juzgado juzgados juzgan juzgando
juzgar juzgo juzgue juzguen laberinto labial labio labios labor laboral laborales laboratorio laboratorios labores
laborista labrador laburar laburo lacayo lacayos lacio lacra lacras lactancia lactea lacteos lactosa ladera laderas
ladilla lado lados ladra ladrar ladrillo ladrillos ladron ladrona ladrones lady lagarto lagartos lago lagos lagrima
lagrimas laguna lagunas laica laico laicos lama lamas lame lamenta lamentable lamentablemente lamentables lamentamos
lamentar lamento lamentos lamer lamina laminas lampara lamparas lana lance lancha lanchas landa langosta langostas lanza
lanzaba lanzada lanzadas lanzado lanzador lanzados lanzamiento lanzamientos lanzamos lanzan lanzando lanzar lanzara
lanzaron lanzas lanzo lapicera lapices lapida lapiz lapso lares larga largamente largar largas largo largometraje largos
larva larvas laser lastima lastimado lastimar lastimosamente lastre lata latas late latente lateral laterales latex
latido latidos latigazos latigo latin latina latinas latino latinoamericana latinoamericano latinos latir latitud
latitudes laton laurel laureles lava lavabo lavadero lavado lavadora lavan lavanderia lavando lavar lavas lave lavo
lazaro lazo lazos leal leales lealtad lean leas leccion lecciones leche lechera leches lecho lechuga lector lectora
lectores lectura lecturas leemos leen leer leera leere lees legado legados legal legales legalidad legalizacion
legalizar legalmente legendaria legendario legendarios legion legiones legislacion legislaciones legislador legisladora
legisladores legislar legislativa legislativas legislativo legislativos legislatura legislaturas legitima legitimacion
legitimamente legitimar legitimas legitimidad legitimo legitimos lego legua leguas legumbres leia leida leido leidos
leila leiste lejana lejanas lejania lejano lejanos lejos lema lemas lena lenceria lengua lenguaje lenguajes lenguas
leninista lenta lentamente lentas lente lentejas lentes lentitud lento lentos leon leona leones leopardo lepra lerdo
lesa lesbiana lesbianas lesion lesionado lesionados lesiones lesiono letal letales letargo leticia letra letrado letras
letrero letreros leucemia levadura levanta levantaba levantada levantadas levantado levantados levantamiento
levantamientos levantamos levantan levantando levantar levantara levantaron levantas levante levanten levantes levanto
leve levemente leves lexico leyenda leyendas leyendo leyera leyeron leyes leyo liado lian liar libanes liber libera
liberacion liberada liberadas liberado liberados liberal liberales liberalismo liberalizacion liberan liberando liberar
liberaron libere liberen libero libertad libertades libertador libertadores libertaria libertario libertarios libido
libra librado librar libras libre libremente libreria librerias libres libreta libreto libro libros licencia licenciada
licenciado licenciados licencias licenciatura liceo liceos licitacion licitaciones licito licor licores licuado
licuadora lider lidera liderada liderado liderados liderando liderar liderato liderazgo lideres lidero lidia lidiando
lidiar liebre lienzo lienzos liga ligada ligadas ligado ligados ligamento ligamentos ligando ligar ligas ligera
ligeramente ligeras ligereza ligero ligeros ligue liguilla lila limbo limita limitaba limitacion limitaciones limitada
limitadas limitado limitados limitan limitando limitar limitaron limite limites limito limitrofes limon limonada limones
limosna limosnas limpia limpiado limpiador limpian limpiando limpiar limpias limpie limpieza limpio limpios linaje
linares lince linchamiento linda lindas linden lindo lindos linea lineal lineales lineamientos lineas linguista
linguistas linguistica linguisticas linguistico linguisticos lino linterna linternas lios liquida liquidacion liquidar
liquidez liquido liquidos lira lirica lirico lisa lisas liso lisos lista listado listados listas listo liston listos
lite litera literal literalmente literaria literarias literario literarios literatura litigio litigios litio litoral
litro litros liturgia liviana liviano living liza llama llamaba llamaban llamada llamadas llamado llamados llamamiento
llamamos llaman llamando llamar llamara llamare llamaremos llamaria llamaron llamas llamaste llamativa llamativo
llamativos llame llamen llames llamo llana llanamente llano llanos llanta llantas llanto llantos llanura llanuras llave
llavero llaves llega llegaba llegaban llegada llegadas llegado llegados llegamos llegan llegando llegar llegara llegaran
llegaras llegare llegaremos llegaria llegarian llegaron llegas llegase llegaste llego llegue lleguemos lleguen llegues
llena llenaba llenado llenan llenando llenar llenaron llenas llene llenen lleno llenos lleras lleva llevaba llevabamos
llevaban llevada llevadas llevado llevados llevais llevamos llevan llevando llevar llevara llevaran llevare llevaremos
llevaria llevarian llevaron llevas llevaste lleve llevemos lleven lleves llevo llora lloraba lloraban llorado lloran
llorando llorar lloras llore llores lloro lloron llorona llosa llover llovia llovido lloviendo llovio llueva llueve
lluvia lluvias lluviosa lluvioso loable loba lobato lobo lobos lobulo lobulos loca locacion locaciones local locales
localidad localidades localiza localizacion localizaciones localizada localizadas localizado localizados localizan
localizar locas locion loco locomotora locomotoras locos locucion locura locuras locutor locutores lodo logia logica
logicamente logicas logico logicos logistica logistico logos logotipo logra lograba lograda logrado logrados logramos
logran logrando lograr lograra lograran lograras lograremos lograria lograron logras lograste logre logremos logren
logro logros lola lolita loma lomas lombardo lomo lomos lona londinense longevidad longitud longitudes longitudinal lora
lord lores loro loros losa losada lote loteria lotes loto loza lozano lubricante lubricantes luca luce lucen lucero
luces lucha luchaba luchaban luchado luchador luchadora luchadores luchamos luchan luchando luchar lucharon luchas luche
luchemos luchen lucho lucidez lucido luciendo lucifer lucio lucir lucrativo lucro luego lugar lugares lugarteniente lujo
lujos lujosa lujoso lujosos lujuria lulu lumbar luminarias luminosa luminosidad luminoso luminosos luna lunar lunares
lunas lunes lupa lupus luto macabro macarena macedonia macedonio maceta macetas mach machado machete machismo machista
machistas macho machos macias macizo macro madera maderas madero madrastra madrazo madre madres madrigal madrina
madrugada madrugar madura maduracion madurado madurar maduras madurez maduro maduros maestra maestras maestre maestria
maestro maestros mafia mafias mafioso mafiosos maga magdalena magia magica magicas magico magicos magisterio magistrado
magistrados magistral magistratura magna magnate magnates magnesio magnetica magnetico magneticos magnetismo magnifica
magnificas magnifico magnificos magnitud magnitudes magno magnum mago magos maiz maja majestad majestuosa majestuoso
majo mala malabares malaga malandros malaria malas malasia malaya malayo maldad maldades maldicion maldiciones maldita
malditas maldito malditos maldivas malecon maleducado malentendido malentendidos males malestar maleta maletas maletero
maletin maleza mali malicia maliciosa malicioso maligna maligno malignos malla mallas mallorca malo malos maltratada
maltratado maltratados maltratar maltrato malvada malvado malvados malversacion mama mamada mamadas mamando mamar mamas
mambo mame mamen mames mamiferos mamita mana manada manager managua manantial manantiales mancera mancha manchada
manchado manchar manchas manco mancomunidad manda mandaba mandaban mandado mandados mandamiento mandamientos mandamos
mandan mandando mandar mandaria mandarin mandarina mandaron mandas mandaste mandatario mandatarios mandato mandatos
mande manden mandes mandibula mandibulas mando mandos maneja manejaba manejada manejado manejados manejamos manejan
manejando manejar manejas maneje manejen manejo manejos manera maneras manga manganeso mangas manglares mango mangos
manguera mani mania manicomio manifestaba manifestacion manifestaciones manifestado manifestando manifestantes
manifestar manifestaron manifesto manifiesta manifiestan manifieste manifiesto manifiestos manija manila maniobra
maniobrar maniobras manipula manipulacion manipulaciones manipulada manipulado manipulador manipulados manipulan
manipulando manipular manitas manjar mano manolo manos mansa mansion mansiones manso manta mantas manteca mantel manten
mantendra mantendran mantendria mantenemos mantener mantenga mantengamos mantengan mantengo mantenia mantenian mantenida
mantenidas mantenido mantenidos manteniendo mantenimiento mantequilla mantiene mantienen mantienes manto mantra mantuve
mantuviera mantuvieron mantuvo manual manuales manualmente manuela manufactura manuscrito manuscritos manutencion
manzana manzanares manzanas manzanilla manzanillo manzano mapa mapas mapuche mapuches maqueta maquetas maquillaje
maquina maquinaria maquinarias maquinas maquinista mara maraton maravilla maravillas maravillosa maravillosamente
maravillosas maravilloso maravillosos marca marcaba marcada marcadamente marcadas marcado marcador marcadores marcados
marcan marcando marcar marcara marcaron marcas marcha marchaba marchado marchamos marchan marchando marchar marcharon
marchas marche marcho marcia marcial marciales marciano marco marcos marea mareas mareo mareos mares marfil marga
margarita margaritas margen margenes marginacion marginado marginados marginal marginales marginalidad mariachi mariana
mariano marias marido maridos marihuana marina marinas marine marinero marineros marines marino marinos marion marioneta
marionetas mariposa mariposas mariquita mariscal marisco mariscos maritima maritimas maritimo maritimos marmol marque
marques marquesa marron marrones marroqui marroquies marruecos martes martillo martin martina martir martires martirio
marxismo marxista marxistas marzo masa masacrados masacre masacres masaje masajes masajista masas mascara mascaras
mascarilla mascarillas mascota mascotas masculina masculinas masculinidad masculino masculinos masiva masivas masivo
masivos maso mason masoneria masones master masticar mastil masturbacion mata mataba mataban matadero mataderos matado
matador matamoros matamos matan matando matanza matanzas matar matara mataran mataria mataron matas mataste mate
matematica matematicamente matematicas matematico matematicos maten mateos materia material materiales materialismo
materialista materias materna maternal maternidad materno mates matices matinal matiz mato maton matones matorrales
matos matrices matricula matriculados matriculas matrimonial matrimoniales matrimonio matrimonios matriz matutina
matutino maule maura mausoleo maxima maximas maxime maximizar maximo maximos maya mayo mayonesa mayor mayoral mayordomo
mayores mayoria mayorias mayorista mayoristas mayoritaria mayoritario mayoritarios mayormente mayuscula mayusculas maza
mazo mean meando mear meca mecanica mecanicas mecanico mecanicos mecanismo mecanismos mecenas mecha mechas medalla
medallas medallista medallon media mediacion mediador mediadores mediados mediana medianamente medianas mediano
medianoche medianos mediante mediar medias mediatica mediaticas mediatico mediaticos medica medicacion medicamento
medicamentos medicas medicina medicinal medicinales medicinas medicion mediciones medico medicos medida medidas medido
medidor medieval medievales medina medio medioambiental mediocre mediocres mediocridad mediodia medios medir meditacion
meditar mediterranea mediterraneo medium medula medular medusa mega megas mejilla mejillas mejor mejora mejorada
mejorado mejoramiento mejoran mejorando mejorar mejorara mejoraron mejoras mejore mejoren mejores mejoria mejoro
melancolia melancolico melena melgar mella mellizos melo melocoton melodia melodias melodrama melon melones membrana
membranas membresia memo memorable memorables memorandum memoria memorial memorias memorizar mena mencion menciona
mencionaba mencionada mencionadas mencionado mencionados mencionamos mencionan mencionando mencionar mencionaron
mencionas mencionaste mencione menciones menciono mendigar mendigo mendigos meneses meningitis meno menor menores menos
menospreciar mensaje mensajeria mensajero mensajeros mensajes menstruacion mensual mensuales mensualmente menta mental
mentales mentalidad mentalmente mente mentes mentido mentir mentira mentiras mentirosa mentiroso mentirosos menton
mentor menu menuda menudo menudos menus meollo mera meramente meras merca mercadeo mercader mercaderes mercaderia
mercado mercados mercadotecnia mercancia mercancias mercante mercantil mercantiles merced mercedes mercenario
mercenarios mercurio merece merecedor merecemos merecen merecer mereces merecia merecian merecida merecido merecio
merengue merezca merezco meridiano meridional merienda merino merito meritos merlin merlo merma mermelada mero meros
mesa mesas mesero meses meseta mesias mesita mestiza mestizaje mestizo mestizos meta metabolismo metafisica metafora
metaforas metal metales metalica metalicas metalico metalicos metalurgia metamorfosis metan metano metas metastasis mete
metemos meten meteorito meteoritos meteorologia meteorologica meteorologicas meteorologico meteorologicos meter meteria
metes metete meti metia metida metido metidos metiendo metieron metimos metio metiste meto metodo metodologia
metodologias metodos metralla metrica metricas metro metropoli metropolis metropolitana metropolitano metros mexicana
mexicanas mexicano mexicanos meza mezcal mezcla mezclada mezcladas mezclado mezclados mezclan mezclando mezclar mezclas
mezquino mezquita mezquitas mias mica micro microfono microfonos microondas microorganismos micros microscopio mide
miden midiendo mido miedo miedos miel miembro miembros mienta mientas miente mienten mientes miento mientras miercoles
miga migajas migas migracion migraciones migrar migratoria migratorias migratorio migratorios mijo milagro milagros
milagrosa milagrosamente milagroso milanesa milanesas milano milena milenaria milenio milenios miles mili milicia
milicianos milicias milimetro milimetros milita militancia militante militantes militar militares militarizacion
militarmente milla millar millares millas millon millonaria millonarias millonario millonarios millones mimo mimos mina
minado minar minas mine minera mineral minerales mineras mineria minero mineros minerva miniatura miniaturas minima
minimas minimizar minimo minimos ministerial ministeriales ministerio ministerios ministra ministro ministros minoria
minorias minorista minoristas minoritaria minoritario minoritarios mintiendo mintieron mintio minuciosa minuciosamente
minucioso minuscula minusculas minusculo minuto minutos mios mira miraba miraban mirada miradas mirado mirador miramos
miran miranda mirando mirar miraron miras mire miremos miren mires miro misa misas miserable miserables miseria miserias
misericordia misericordioso misil misiles mision misionera misionero misioneros misiones misiva mismas mismos misoginia
miss mister misterio misterios misteriosa misteriosamente misteriosas misterioso misteriosos mistica mistico misticos
mistral mitad mitades mitica mitico mitigar mitin mitines mito mitologia mitos mixta mixtas mixto mixtos mobiliario
mochila mochilas mocion moco mocos moda modales modalidad modalidades modas modelado modelar modelo modelos moderacion
moderada moderadamente moderadas moderado moderador moderadores moderados moderar moderna modernas modernidad modernismo
modernista modernizacion modernizar moderno modernos modesta modestas modestia modesto modestos modifica modificacion
modificaciones modificada modificadas modificado modificados modifican modificando modificar modifico modifique modo
modos modular modulo modulos moho moises moja mojada mojado mojados mojar mojo mojon mola molar molde moldes mole
molecula molecular moleculas moler molesta molestaba molestado molestan molestando molestar molestaria molestas moleste
molesten molestes molestia molestias molesto molestos molida molido molino molinos molotov moluscos momentaneamente
momento momentos momia momias momo mona monarca monarcas monarquia monarquias monarquico monasterio monasterios moneda
monedas monedero monetaria monetarias monetario monetarios monitor monitores monja monjas monje monjes mono monografia
monologo monologos monopolio monopolios monos monotonia monstruo monstruos monstruosa monstruoso monta montada montado
montados montaje montajes montan montana montando montano montar montaron monte montero monterrey montes montesinos
montilla monto monton montoneros montones montos montura monumental monumentales monumento monumentos monzon mora morada
moradas morado moradores moral moraleja morales moralidad moralmente moran moras moratoria morbo morboso morcilla
mordaza morder mordida mordido mordio mordisco more morena morenas moreno morenos moretones morfina morfologia morgue
mori moria morian moribundo morimos morir morira moriran morire moriria moriscos moro moron moros morra morro morros
morse mortal mortales mortalidad mortero morteros mosaico mosaicos mosca moscas mosquito mosquitos mostaza mostraba
mostraban mostrada mostrado mostrador mostrados mostramos mostrando mostrar mostrara mostraremos mostraron mostre mostro
mota mote motel motin motiva motivacion motivaciones motivada motivado motivados motivan motivar motivaron motivo
motivos moto motocicleta motocicletas motociclista motociclistas motor motores motorizado motorizados motos motriz move
movemos mover movia movian movida movidas movido moviendo movieron movil moviles movilidad moviliza movilizacion
movilizaciones movilizado movilizar movilizo movimiento movimientos movio moya mozo mozos mucha muchacha muchachas
muchacho muchachos muchas muchedumbre mucho muchos mucosa muda mudado mudanza mudanzas mudar mudaron mudas mude mudo
mudos mueble muebles mueca muela muelas muelle muelles mueran mueras muerde muerden mueren mueres muerta muertas muerte
muertes muerto muertos muestra muestran muestras muestre muestren muestreo muestro muevan muevas mueven mueves mugre
mujer mujeres mujeriego mula mulas muletas multa multas multicultural multilateral multimedia multimillonario
multimillonarios multinacional multinacionales multiple multiples multiplica multiplicacion multiplicado multiplican
multiplicar multiplicidad multitud multitudes multitudinaria mundial mundiales mundo mundos municion municiones
municipal municipales municipalidad municipalidades municipio municipios mural murales muralla murallas murcielago
murcielagos murga muriendo muriera murieron murio murmullo muro muros musa musas muscular musculares musculatura musculo
musculos musculoso museo museos musgo musica musical musicales musicas musico musicos muslo muslos musulman musulmana
musulmanas musulmanes mutacion mutaciones mutante mutantes mutilacion mutua mutual mutuamente mutuas mutuo mutuos nabo
nace nacemos nacen nacer nacho naci nacia nacida nacidas nacido nacidos naciendo naciente naciera nacieron nacimiento
nacimientos nacimos nacio nacion nacional nacionales nacionalidad nacionalidades nacionalismo nacionalista nacionalistas
nacionalizacion naciones naciste naco nada nadador nadadores nadal nadando nadar nado nafta nahuatl naipes nalga nalgas
namibia nana napoleon naranja naranjas naranjo naranjos narcisista narciso narco narcos narcoticos narcotraficante
narcotrafico narices nariz narra narracion narraciones narrado narrador narradores narran narrar narrativa narrativas
narrativo nasa nasal nasales nata natacion natal natalicio natalidad nativa nativas natividad nativo nativos nato natura
natural naturales naturaleza naturalidad naturalista naturalizacion naturalmente naufragio nauseas nautica nautico nava
navaja navajas naval navales navarra navarro navarros nave navega navegacion navegador navegadores navegando navegante
navegantes navegar naves navidad navidades navio navios nazareno neblina nebulosa necesaria necesariamente necesarias
necesario necesarios necesidad necesidades necesita necesitaba necesitabamos necesitaban necesitabas necesitada
necesitadas necesitado necesitados necesitamos necesitan necesitando necesitar necesitara necesitaran necesitaras
necesitaremos necesitaria necesitarian necesitas necesite necesiten necesites necesito necio necios nectar nefasta
nefasto negaba negaban negacion negada negado negamos negando negar negaron negativa negativamente negativas negatividad
negativo negativos negligencia negligente nego negocia negociable negociacion negociaciones negociado negociador
negociadores negociados negocian negociando negociar negocio negocios negra negras negrita negrito negro negros negue
nena nenas nene nenes neoliberal neoliberales neoliberalismo neon nepotismo nervio nervios nerviosa nerviosas
nerviosismo nervioso nerviosos neta netamente neto netos neumatico neumaticos neumonia neurona neuronal neuronas neutra
neutral neutrales neutralidad neutralizar neutro nevada nevadas nevado nevera nexo nexos nicaragua nicaraguense
nicaraguenses nicho nichos nicotina nido nidos niebla niega niegan niego niegue nieguen nieta nieto nietos nieva nieve
nieves nigeriano ninfa ningun ninguna ninguno niquel nirvana nitrato nitrogeno nivel niveles nobel noble nobles nobleza
noche noches nocion nociones nocivo nocivos nocturna nocturnas nocturno nocturnos nodo nodos nogal nogales noguera
nomada nomadas nombra nombrada nombradas nombrado nombrados nombramiento nombramientos nombran nombrando nombrar
nombraron nombre nombres nombro nomenclatura nomina nominacion nominaciones nominada nominado nominados nominal
nominales nominas nono norcoreano nordeste nordico nordicos noreste noria norma normal normales normalidad normalistas
normalizacion normalizar normalmente norman normas normativa normativas normativo noroeste norte norteamericana
norteamericanas norteamericano norteamericanos noruega noruego noruegos nosotras nosotros nostalgia nostalgico nota
notaba notable notablemente notables notado notamos notan notando notar notaria notarial notario notaron notas note
noten notes noticia noticias noticiero noticieros notificacion notificaciones notificado notificar notifico noto notoria
notoriamente notoriedad notorio notorios nova novato novatos novecientos novedad novedades novedosa novedoso novel
novela novelas novelista novelistas novena noveno noventa novia novias noviazgo noviembre novio novios novo nube nubes
nublado nuca nuclear nucleares nucleo nucleos nudo nudos nueces nuera nuestra nuestras nuestro nuestros nueva nuevamente
nuevas nueve nuevo nuevos nuez nula nulas nulidad nulo nulos numeracion numeral numerica numerico numero numeros
numerosa numerosas numeroso numerosos nuncio nupcial nupcias nutre nutricion nutricional nutricionista nutrido
nutrientes nutritivo oasis obedece obedecen obedecer obediencia obediente obelisco obesidad obeso obispado obispo
obispos objecion objeciones objetiva objetivamente objetivas objetividad objetivo objetivos objeto objetos obliga
obligaba obligaban obligacion obligaciones obligada obligadas obligado obligados obligan obligando obligar obligara
obligaron obligatoria obligatorias obligatoriedad obligatorio obligatorios obligo obligue obliguen obra obrador obrar
obras obregon obrera obreras obrero obreros obsceno obsequio obsequios observa observaba observacion observaciones
observada observadas observado observador observadores observados observamos observan observancia observando observar
observaron observatorio observe observen observo obsesion obsesionada obsesionado obsesionados obsesiones obsesiva
obsesivo obsoleta obsoleto obsoletos obstaculizar obstaculo obstaculos obstante obstetricia obstruccion obten obtencion
obtendra obtendran obtendria obtenemos obtener obtenga obtengan obtenia obtenida obtenidas obtenido obtenidos obteniendo
obtiene obtienen obtienes obtuve obtuvieron obtuvimos obtuvo obvia obviamente obviar obvias obvio obvios ocasion
ocasiona ocasionado ocasionados ocasional ocasionales ocasionalmente ocasionando ocasionar ocasiones ocasiono ocaso
occidental occidentales occidente oceanos ochenta ocho ochocientos ocio octava octavo octavos octubre ocular oculares
oculta ocultado ocultan ocultando ocultar ocultas oculto ocultos ocupa ocupaba ocupaban ocupacion ocupacional
ocupaciones ocupada ocupadas ocupado ocupados ocupamos ocupan ocupando ocupante ocupantes ocupar ocupara ocuparon ocupas
ocupe ocupen ocupo ocurra ocurran ocurre ocurren ocurrencia ocurrencias ocurria ocurrida ocurridas ocurrido ocurridos
ocurriendo ocurriera ocurrieron ocurrio ocurrir ocurrira ocurriria odia odiaba odiado odiamos odian odiar odias odie
odio odios odiosa odioso odisea odontologia oeste ofenda ofende ofenden ofender ofendida ofendido ofendidos ofensa
ofensas ofensiva ofensivas ofensivo ofensivos oferta ofertas oficial oficiales oficialismo oficialista oficialistas
oficialmente oficina oficinas oficio oficios ofrece ofrecemos ofrecen ofrecer ofrecera ofreces ofreci ofrecia ofrecian
ofrecida ofrecidas ofrecido ofrecidos ofreciendo ofrecieron ofrecimiento ofrecio ofrenda ofrendas ofrezca ofrezcan
ofrezco ogro oido oidos oiga oigan oigo oimos ojala ojeada ojeras ojitos ojos olas oleada oleadas oleaje oleo oler
olfato olia oliendo oligarca oligarcas oligarquia olimpiada olimpiadas olimpica olimpicas olimpico olimpicos oliva
olivar olivares olivera olivo olivos olla ollas olmedo olmo olmos olor olores olvida olvidaba olvidada olvidadas
olvidado olvidados olvidamos olvidan olvidando olvidar olvidara olvidare olvidaremos olvidaron olvidas olvidaste olvide
olvideis olvidemos olviden olvides olvido ombligo omega omision omisiones omiso omite omitir omnibus omnipresente once
onda ondas onzas opaca opacidad opaco opcion opcional opciones open opera operaba operacion operacional operaciones
operada operado operador operadora operadoras operadores operados operan operando operar operario operarios operaron
operativa operativas operativo operativos opere opero opina opinaba opinan opinando opinar opinas opine opinion
opiniones opino opio opone oponen oponente oponentes oponga opongo oponia oponian oporto oportuna oportunamente
oportunas oportunidad oportunidades oportunismo oportunista oportunistas oportuno oposicion oposiciones opositor
opositora opositores opresion opresor opresores oprime oprimido oprimidos oprimir opta optado optan optar optaron optica
opticas optico optima optimas optimismo optimista optimistas optimizacion optimizar optimo opto opuesta opuestas opuesto
opuestos opus opusieron opuso oracion oraciones oraculo orador oradores oral orales orando orar oratoria oratorio orbe
orbita orbitas orcos orden ordena ordenaba ordenacion ordenada ordenadas ordenado ordenador ordenadores ordenados
ordenamiento ordenan ordenando ordenanza ordenanzas ordenar ordenaron ordene ordenes ordeno ordinaria ordinarias
ordinario ordinarios oreja orejas orellana orense oreo orfanato organica organicas organice organico organicos organismo
organismos organiza organizacion organizaciones organizada organizadas organizado organizador organizadora organizadores
organizados organizamos organizan organizando organizar organizaron organizativa organizativas organizativo organizo
organo organos orgullo orgullosa orgullosamente orgulloso orgullosos oribe orienta orientacion orientaciones orientada
orientadas orientado orientados oriental orientales orientar oriente orificio orificios origen origenes origina
originada originado original originales originalidad originalmente originan originaria originariamente originarias
originario originarios originaron origino orilla orillas oriol oriundo orlando ornamentos oros orquesta orquestas
orquidea orquideas ortega orto ortodoxa ortodoxia ortodoxo ortodoxos ortografia oruga osadia osado oscila oscilan oscura
oscuras oscuridad oscuro oscuros osea osos ostenta ostentan ostentar ostia ostras osuna otero otomano otorga otorgada
otorgadas otorgado otorgados otorgamiento otorgan otorgando otorgar otorgara otorgaron otorgo otorgue otra otro otrora
ovacion oval ovario ovarios oveja ovejas ovni ovnis ovulo ovulos oxidacion oxidado oxido oxigeno oyen oyendo oyente
oyentes oyeron oyes ozono pabellon pabellones pace paces pacheco pachuca paciencia paciente pacientemente pacientes
pacifica pacificacion pacificamente pacificas pacificos pacifista paco pactado pactar pacto pactos padece padecen
padecer padecia padecido padeciendo padecimiento padilla padrastro padre padres padrino padrinos padron paella paga
pagaba pagaban pagada pagadas pagado pagados pagamos pagan pagando pagano paganos pagar pagara pagaran pagare pagaria
pagaron pagas pagaste pagina paginas pago pagos pague paguen pagues pais paisaje paisajes paisano paisanos paises paja
pajarito pajaritos pajaro pajaros pajas pajero pala palabra palabras palacio palacios paladar palanca palancas palas
palco palenque palestina palestino palestinos palestra paleta paletas paliar palida palido palio palito palitos paliza
palizas palma palmar palmas palmera palmeras palo paloma palomar palomas palomino palomitas palomo palos palpable pamela
pampa pampas pamplona pana panacea panaderia panaderias panadero panal panama panamericana panamericano panas pancarta
pancartas pancho pancreas panda pandemia pandilla pandillas pandilleros pando panel paneles panes panfleto panfletos
panico panorama panoramica pantalla pantallas pantalon pantalones pantano pantanos panteon pantera panza papa papal
papas papaya papel papeleo papelera papeleria papeles papeleta papeletas papua paquete paquetes para paraba parabola
parabrisas paracaidas paracaidistas parada paradas paradero paradigma paradigmas parado paradoja paradojas paradojico
parados paraguas paraguay paraguaya paraguayo paraguayos paraiso paraisos paraje parajes paralela paralelamente
paralelas paralelismo paralelo paralelos paralimpicos paralisis paraliza paralizacion paralizada paralizado paralizar
paralizo paramedicos parametro parametros paramilitar paramilitares paramo paramos paran parando paranoia paranoico
paranormal paranormales parar pararon paras parasito parasitos parcela parcelas parche parches parcial parciales
parcialidad parcialmente parda pardo pare parece parecemos parecen parecer parecera pareceria pareces parecia parecian
parecida parecidas parecido parecidos pareciendo pareciera parecieron parecio pared paredes pareja parejas parejo
paremos paren parental parentesco parentesis pares parezca parezcan parezco paria paridad pariente parientes pario parir
paritaria paritarias parla parlamentaria parlamentarias parlamentario parlamentarios parlamento parlamentos parlante
parlantes paro parodia parodias paros parpados parque parques parra parrafo parrafos parrilla parroco parroquia
parroquial parroquias parta parte parten partes partia particion participa participaba participaban participacion
participaciones participado participamos participan participando participante participantes participar participara
participaran participaron participe participen participes participo particula particular particulares particularidad
particularmente particulas partida partidaria partidario partidarios partidas partidista partidistas partido partidos
partiendo partieron partimos partio partir partitura partituras parto partos pasa pasaba pasaban pasada pasadas pasado
pasados pasaje pasajera pasajero pasajeros pasajes pasamos pasan pasando pasante pasantia pasaporte pasaportes pasar
pasara pasaran pasare pasarela pasaremos pasaria pasarian pasaron pasase pasaste pasatiempo pasatiempos pascal pasco
pascua pascual pascuas pase pasea paseaba pasean paseando pasear pasemos pasen paseo paseos pases pasillo pasillos
pasion pasional pasiones pasito pasiva pasividad pasivo pasivos paso pasos pasta pastas pastel pasteleria pasteles
pastilla pastillas pasto pastor pastora pastoral pastoreo pastores pastos pastrana pata patada patadas patas patata
patatas patea pateando patear patente patentes paterna paternal paternidad paterno patetica patetico pateticos patinaje
patinar patines patio patios patitas patito pato patogenos patologia patologias patos patria patriarca patriarcado
patriarcal patrias patricia patricio patricios patrimonial patrimoniales patrimonio patrio patrios patriota patriotas
patriotica patriotico patriotismo patrocinada patrocinado patrocinador patrocinadores patrocinio patron patrona patronal
patronales patronato patrones patrono patronos patrulla patrullas patrullero paul paulatina paulatinamente paulina
paulino pausa pausas pauta pautas pava pavadas pavimentacion pavimento pavo pavon pavor pavos payaso payasos peaje
peajes peaton peatonal peatonales peatones pecado pecador pecadores pecados pecar pecas peces pecho pechos pechuga
peculiar peculiares peculiaridad peculiaridades pedagogia pedagogica pedagogicas pedagogico pedagogicos pedal pedales
pedazo pedazos pedestal pedi pedia pedian pediatra pediatria pedido pedidos pedimos pedir pedira pediran pedire pediria
pedis pediste pedo pedofilia pedofilo pedofilos peer pega pegaba pegada pegadas pegado pegados pegajosa pegamento pegan
pegando pegar pegaron pegas pego peguen peinado peinados peine pela pelada pelado pelaje pelar pele pelea peleaban
peleado peleamos pelean peleando pelear pelearon peleas peleen peleo pelicula peliculas peligro peligros peligrosa
peligrosamente peligrosas peligrosidad peligroso peligrosos pelirroja pellejo pelo pelos pelota pelotas peloton peluca
peluche peluda peludo peludos peluqueria peluquero pelvis pena penado penal penales penalidades penalizacion penalmente
penalti penaltis penas pendiente pendientes pendulo penicilina peninsula peninsular penitencia penitenciaria
penitenciario penosa penoso pensa pensaba pensabamos pensaban pensabas pensad pensada pensadas pensado pensador
pensadores pensados pensais pensamiento pensamientos pensamos pensando pensante pensar pensara pensaran pensaria
pensaron pensas pensaste pense pensemos pension pensionados pensiones pensionistas penso pentagono penultima penultimo
penurias peon peones peor peores pepa pepe pepino pepita pepito peques pera peralta peras percepcion percepciones
percibe perciben percibida percibido percibidos percibio percibir percibo percusion perdamos perdedor perdedores
perdemos perder perdera perderan perderas perderia perdia perdian perdicion perdida perdidas perdido perdidos perdiendo
perdiera perdieron perdimos perdio perdiste perdiz perdon perdona perdonado perdonan perdonar perdonas perdone perdonen
perdones perdono perdura peregrinacion peregrinaje peregrino peregrinos perejil perenne pereza perezoso perezosos
perfeccion perfeccionar perfecta perfectamente perfectas perfecto perfectos perfil perfiles perforacion perforaciones
perforar perfume perfumes pergamino pericia perico periferia periferica periferico perifericos perimetro periodica
periodicamente periodicas periodicidad periodico periodicos periodismo periodista periodistas periodistica periodisticas
periodistico periodisticos periodo periodos periplo perito peritos perjudica perjudicado perjudicados perjudican
perjudicando perjudicar perjudicial perjudiciales perjuicio perjuicios perla perlas permanece permanecen permanecer
permanecera permaneceran permanecia permanecian permanecido permaneciendo permanecieron permanecio permanencia
permanente permanentemente permanentes permanezca permanezcan permiso permisos permita permitan permitas permite
permiten permites permitia permitian permitida permitidas permitido permitidos permitiendo permitiera permitieran
permitieron permitimos permitio permitir permitira permitiran permitiremos permitiria permitirian permito pero peronismo
peronista peronistas peros perpendicular perpetrado perpetua perpetuar perpetuo perplejo perra perras perrito perritos
perro perros persas persecucion persecuciones perseguia perseguian perseguida perseguido perseguidos perseguir
perseverancia persianas persico persigue persiguen persiguiendo persiguio persiste persisten persistencia persistente
persistentes persona personaje personajes personal personales personalidad personalidades personalizada personalizadas
personalizado personalizados personalmente personas personeria personificacion perspectiva perspectivas persuadir
persuasion pertenece pertenecemos pertenecen pertenecer perteneces pertenecia pertenecian pertenecido perteneciente
pertenecientes pertenecio pertenencia pertenencias pertenezca pertenezcan pertenezco pertinencia pertinente pertinentes
perturba perturbacion perturbaciones perturbado perturbador perturbar peruana peruanas peruano peruanos perversa
perversion perverso perversos pervertido pesa pesaba pesada pesadas pesadilla pesadillas pesado pesados pesame pesan
pesar pesas pesca pescado pescador pescadores pescados pescar pese pesetas pesima pesimas pesimismo pesimista pesimistas
pesimo peso pesos pesquera pesqueras pesquero pesqueros peste pestes pesticidas petalos petardos pete peticion
peticiones petroleo petroleos petrolera petroleras petrolero petroleros pezon pezones pianista piano piba pibas pibe
pibes pica picada picado picadura pican picando picante picantes picar picardia picas pichincha pico picos pida pidamos
pide pidiendo pidiera pidieron pidio pido piedad piedra piedras piel pieles piensa piensan piensas piense piensen
pienses pienso pierda pierdan pierdas pierde pierden pierdes pierdo pierna piernas pies pieza piezas pigmentos pila
pilares pilas pildora pildoras pileta pilla pillado pillan pillar pillas pillo piloto pilotos pimienta pimiento
pimientos pina pinar pincel pincha pinchar pinche pinches pineda pinedo pines pinguino pinguinos pino pinocho pinos
pinta pintaba pintada pintadas pintado pintados pintan pintando pintar pintaron pintas pinte pinto pintor pintora
pintores pintoresca pintoresco pintura pinturas pinza pinzas pinzon piojo piojos piola pionera pionero pioneros pipa
pipas pique piquete piquetes piramidal piramide piramides pirata piratas pirateria pirineo pirineos piropos pisa pisadas
pisado pisando pisar piscina piscinas piscis pisco piso pisos pista pistas pistola pistolas pistolero pita pito pitos
pixel pixeles pizarra pizca pizza pizzeria placa placas place placebo placenta placentera placentero placer placeres
placido plaga plagada plagado plagas plagio plan plana planas plancha planchar planchas planea planeaba planeacion
planeada planeado planeamiento planeamos planean planeando planear planeas planeo planes planeta planetaria planetario
planetas planicie planificacion planificada planificado planificar planilla planillas plano planos planta plantacion
plantaciones plantada plantado plantados plantar plantas plantea planteaba planteada planteadas planteado planteados
planteamiento planteamientos plantean planteando plantear plantearon plantel planteles planteo plantilla plantillas
planto planton plaquetas plasma plasmado plasmar plastica plasticas plastico plasticos plata plataforma plataformas
platano platanos platea plateada plateado platense platica platicando platicar platicas platillo platillos platino plato
platon platonico platos plausible playa playas playera plaza plazas plazca plazo plazos plebe plebiscito plegaria
plegarias pleito pleitos plena plenamente plenaria plenario plenas plenitud pleno plenos pliego pliegues plomero plomo
pluma plumas plural pluralidad pluralismo plurinacional plus plusvalia poblacion poblaciones poblada pobladas poblado
pobladores poblados pobre pobres pobreza poca pocas poco pocos poda podais podamos podeis podemos poder poderes poderio
poderosa poderosas poderoso poderosos podes podia podiamos podian podias podido podio podra podran podras podre podreis
podremos podria podriamos podrian podrias podrida podrido podridos poema poemario poemas poesia poesias poeta poetas
poetica poeticas poetico poetisa polaca polaco polacos polar polares polarizacion polarizado polemica polemicas polemico
polemicos polen police policia policial policiales policias polideportivo poligono polilla politecnica politecnico
politica politicamente politicas politico politicos politologo poliza polizas pollera pollo pollos polo polos polvo
polvora polvos pomada pomo poncho pondra pondran pondre pondremos pondria pondrian pone ponemos ponen ponencia ponencias
ponente ponentes poner pones ponga pongamos pongan pongas pongo ponia ponian poniendo poniente pontificado pontifice
pontificia popa pope popular populares popularidad popularmente populista populistas poquito porcelana porcentaje
porcentajes porcentual porcentuales porche porcina porcion porciones pormenores poronga poros porque porqueria
porquerias porra porras porros porta portaaviones portaba portada portadas portado portador portadora portadores
portafolio portal portales portan portando portar portatil portatiles portavoces portavoz porte porteria portero
porteros portes portico portillo porto porton portuaria portugues portuguesa portuguesas portugueses porvenir posa
posada posadas posando posar pose posea posean posee poseedor poseemos poseen poseer poseia poseian poseida poseido
poseo poses posesion posesiones posgrado posguerra posibilidad posibilidades posibilita posibilitar posible posiblemente
posibles posicion posiciona posicionado posicionamiento posicionar posiciones positiva positivas positivismo positivo
positivos poso posponer posta postal postales poste postea posteado postear posteo poster posteridad posterior
posteriores posterioridad posteriormente postes postgrado postor postre postres postula postulacion postulado postulados
postulantes postular postulo postura posturas potable potasio pote potencia potencial potenciales potencialidades
potencialmente potenciar potencias potente potentes potestad potosi potro poza pozo pozos practica practicaba practicada
practicado practicamente practican practicando practicante practicantes practicar practicas practico practicos pradera
praderas prado prados pragmatica pragmatico pragmatismo praxis preambulo precaria precarias precariedad precario
precarios precaucion precauciones precede precedente precedentes precedida precedido precepto preceptos preciado
preciados precio precios preciosa preciosas preciosidad precioso preciosos precipicio precipitacion precipitaciones
precipitado precisa precisamente precisan precisar precisas precision preciso precisos precoz precursor precursores
predecesor predecesores predecible predecir predica predicacion predicador predicadores predicar prediccion predicciones
predice predijo predileccion predilecto predio predios predisposicion predomina predominan predominante predominantes
predominio preescolar prefacio prefecto prefectura preferencia preferencial preferencias preferente preferentemente
preferentes preferia preferian preferible preferiblemente preferida preferidas preferido preferidos preferimos preferir
preferiria prefiera prefieran prefiere prefieren prefieres prefiero prefijo prefiriendo prefirieron prefirio pregon
pregunta preguntaba preguntaban preguntado preguntamos preguntan preguntando preguntar preguntaria preguntaron preguntas
preguntaste pregunte pregunten preguntes pregunto prehistoria prejuicio prejuicios prelado preliminar preliminares
preludio prematura prematuramente prematuro premeditado premia premiacion premiada premiado premiados premiar premio
premios premisa premisas prenda prendas prende prenden prender prendida prendido prendieron prendio prendo prensa
preocupa preocupaba preocupacion preocupaciones preocupada preocupadas preocupado preocupados preocupamos preocupan
preocupando preocupante preocupantes preocupar preocupas preocupe preocupen preocupes preocupo prepara preparaba
preparaban preparacion preparaciones preparada preparadas preparado preparados preparamos preparan preparando preparar
prepararon preparativos preparatoria prepare preparen preparo preponderante prepotencia prepotente prerrogativas pres
presa presagio presas presbitero prescindir prescripcion presencia presenciado presencial presenciales presenciar
presencio presenta presentaba presentaban presentacion presentaciones presentada presentadas presentado presentador
presentadora presentadores presentados presentamos presentan presentando presentar presentara presentaran presentaremos
presentaria presentaron presentas presente presenten presentes presentimiento presento preservacion preservar
preservativo preservativos preside presidencia presidencial presidenciales presidenta presidente presidentes presidida
presidido presidio presidir presiento presion presiona presionado presionan presionando presionar presione presiones
presiono preso presos presta prestaba prestacion prestaciones prestada prestado prestados prestamista prestamistas
prestamo prestamos prestan prestando prestar prestaron prestas preste presten prestigio prestigiosa prestigiosas
prestigioso prestigiosos presto presume presumen presumiendo presumir presuncion presunta presuntamente presuntas
presunto presuntos presupone presupuestaria presupuestarias presupuestario presupuestarios presupuesto presupuestos
pretemporada pretenda pretendan pretende pretendemos pretenden pretender pretendes pretendia pretendian pretendido
pretendiendo pretendiente pretendientes pretendio pretendo pretension pretensiones pretexto pretextos prevalece
prevalecer prevalencia prevaricacion preve preveia preven prevencion prevenir preventiva preventivas preventivo prever
previa previamente previas previene previo previos previsible prevision previsiones prevista previstas previsto
previstos prieto prima primaria primarias primario primarios primas primates primavera primaveral prime primer primera
primeramente primeras primero primeros primicia primitiva primitivas primitivo primitivos primo primogenito primordial
primos princesa princesas principado principal principales principalmente principe principes principiante principiantes
principio principios prior prioridad prioridades prioritaria prioritario prioritarios priorizar prisa prisas prision
prisionera prisionero prisioneros prisiones prisma priva privacidad privacion privada privadas privado privados privar
privatizacion privatizaciones privatizar privilegiada privilegiadas privilegiado privilegiados privilegio privilegios
proa probabilidad probabilidades probable probablemente probables probada probado probados probamos probando probar
probaron probaste probe problema problemas problematica problematicas problematico problematicos probo proceda procedan
procede proceden procedencia procedente procedentes proceder procedera procedia procedian procedieron procedimiento
procedimientos procedio procer proceres procesa procesada procesado procesador procesadores procesados procesal
procesales procesamiento procesan procesar procesion procesiones proceso procesos proclama proclamacion proclamada
proclamado proclamar proclamo procrear procura procurador procuradores procuraduria procurando procurar prodigio
produccion producciones produce producen producia producian producida producidas producido producidos produciendo
producir producira produciran produciria productiva productivas productividad productivo productivos producto productor
productora productoras productores productos produjera produjeron produjo produzca produzcan profe profecia profecias
profes profesion profesional profesionales profesionalidad profesionalismo profesiones profesionistas profesor profesora
profesorado profesoras profesores profeta profetas profugo profunda profundamente profundas profundidad profundidades
profundiza profundizacion profundizar profundo profundos progenitor progenitores programa programacion programada
programadas programado programador programadores programados programar programas programo progresa progresado
progresando progresar progresion progresista progresistas progresiva progresivamente progresivo progreso progresos
prohibe prohiben prohibia prohibicion prohibiciones prohibida prohibidas prohibido prohibidos prohibiendo prohibieron
prohibio prohibir projimo prole proletariado proliferacion prolifico prologo prolonga prolongacion prolongada prolongado
prolongados prolongar prolongo promedio promedios promesa promesas promete prometedor prometedora prometen prometer
prometi prometia prometida prometido prometiendo prometieron prometio prometiste prometo prominente prominentes
promocion promociona promocional promocionales promocionando promocionar promociones promotor promotora promotores
promover promovida promovido promoviendo promovieron promovio promueva promuevan promueve promueven promulgacion
promulgada promulgado promulgo pronombre pronombres pronostico pronosticos pronta pronto pronuncia pronunciacion
pronunciada pronunciadas pronunciado pronunciamiento pronuncian pronunciar pronuncie pronuncio propaga propagacion
propaganda propagandas propagar propenso propensos propia propiamente propias propicia propiciado propiciar propicio
propiedad propiedades propietaria propietario propietarios propina propinas propio propios propone proponemos proponen
proponer propones proponga propongo proponia proponiendo proporcion proporciona proporcionaba proporcionada
proporcionadas proporcionado proporcionados proporcional proporcionales proporcionan proporcionando proporcionar
proporcionara proporcionaron proporcione proporciones proporciono proposicion proposiciones proposito propositos
propuesta propuestas propuesto propuestos propulsion propuse propusieron propuso prorroga pros prosa proseguir
proselitismo prosigue prosiguio prospecto prospera prosperar prosperidad prospero prostata protagonismo protagonista
protagonistas protagoniza protagonizada protagonizado protagonizar protagonizo proteccion protecciones proteccionismo
protector protectora protectorado protectoras protectores protege protegen proteger protegia protegida protegidas
protegido protegidos protegiendo protegio proteina proteinas proteja protejan protesis protesta protestan protestando
protestante protestantes protestantismo protestar protestaron protestas protesto protocolo protocolos prototipo
prototipos provecho provee proveedor proveedores proveen proveer provenia provenian proveniente provenientes provenir
proverbio proverbios providencia proviene provienen provincia provincial provinciales provincias provino provision
provisional provisionales provisiones provisorio provista provisto provistos provoca provocaba provocacion provocaciones
provocada provocadas provocado provocador provocados provocan provocando provocar provocara provocaria provocaron
provoco provoque proxima proximamente proximas proximidad proximidades proximo proximos proyeccion proyecciones proyecta
proyectada proyectado proyectan proyectando proyectar proyectil proyectiles proyecto proyector proyectos prudencia
prudente prudentes prueba prueban pruebas pruebe prueben pruebo psicoanalisis psicoanalista psicologa psicologia
psicologica psicologicas psicologico psicologicos psicologo psicologos psicopata psicopatas psicosis psicoterapia psique
psiquiatra psiquiatras psiquiatria psiquiatrica psiquiatrico psiquiatricos psiquica psiquico psiquicos puas pubertad
publica publicaba publicacion publicaciones publicada publicadas publicado publicados publicamente publicamos publican
publicando publicar publicara publicaran publicaron publicas publicidad publicidades publicista publicitaria
publicitarias publicitario publicitarios publico publicos publique publiquen pucha pude pudiendo pudiera pudieramos
pudieran pudieras pudieron pudiese pudiesen pudimos pudiste pudo pudor pudra pudre puebla pueblo pueblos pueda puedan
puedas puede pueden puedes puedo puente puentes puerco puercos puerta puertas puerto puertos pues puesta puestas puesto
puestos pugna puja pulga pulgada pulgadas pulgar pulgas pulido pulir pulmon pulmonar pulmones pulpa pulpito pulpo pulsa
pulsaciones pulsar pulse pulsera pulseras pulso puma pumas puno punta puntaje puntajes puntas punteria puntero punteros
puntillas punto puntos puntuacion puntuaciones puntual puntuales puntualidad puntualmente pupila pupilas pura puramente
puras pure pureza purga purgatorio purificacion puro puros purpura puse pusiera pusieran pusieron pusimos pusiste puso
putear pyme pymes quebrada quebradas quebrado quebrar quebro quechua queda quedaba quedaban quedado quedamos quedan
quedando quedar quedara quedaran quedaras quedare quedaremos quedaria quedarian quedaron quedas quedase quedaste quede
quedemos queden quedes quedo quehacer queja quejaba quejado quejamos quejan quejando quejar quejaron quejas queje quejes
quejo quema quemada quemadas quemado quemados quemaduras queman quemando quemar quemaron quemas queme quemen quemo quepa
querais queramos quereis querella querellas queremos querer queres queria queriamos querian querias querida queridas
querido queridos queriendo querra querran querras querria querrian quesada queso quesos quicio quid quiebra quiebre
quien quienes quienquiera quier quiera quieran quieras quiere quieren quieres quiero quieta quieto quietos quijada
quijote quilla quilombo quilombos quimera quimica quimicas quimico quimicos quimioterapia quince quincena quinientos
quinta quintana quintas quintero quintin quinto quiosco quique quirofano quirurgica quirurgicas quirurgico quise
quisiera quisieramos quisieran quisieras quisieron quisimos quisiste quiso quita quitaba quitado quitamos quitan
quitando quitar quitara quitaria quitaron quitas quite quiten quites quiza quizas quorum rabia rabino rabioso rabo racha
rachas racial raciales racimo racimos racion racional racionales racionalidad racionamiento raciones racismo racista
racistas rada radar radares radiacion radiaciones radiador radial radiales radiante radica radicado radical radicales
radicalismo radicalmente radio radiodifusion radiografia radios rafa rafaga rafagas raices rain raiz raja rallado rama
ramal ramas rambla ramificaciones ramiro ramo ramona ramos rampa rampas rana ranas rancho ranchos rancio rand rango
rangos ranura rapida rapidamente rapidas rapidez rapido rapidos rapto rara raramente raras rareza raro raros rasca
rascacielos rasgo rasgos raso rastrear rastreo rastro rastros rata ratas ratifica ratificacion ratificada ratificado
ratificar ratifico ratio rato raton ratones ratos raya rayado rayados rayas rayo rayos raza razas razon razonable
razonablemente razonables razonamiento razonamientos razonar razones reabrir reaccion reacciona reaccionado reaccionan
reaccionando reaccionar reaccionaria reaccionario reaccionarios reacciones reacciono reactiva reactivacion reactivar
reactivo reactivos reactor reactores reafirma reafirmar reafirmo real reales realeza realice realicen realidad
realidades realismo realista realistas realiza realizaba realizaban realizacion realizada realizadas realizado
realizador realizadores realizados realizamos realizan realizando realizar realizara realizaran realizaria realizaron
realizo realmente reanudacion reanudar reaparece reaparicion rebaja rebajado rebajar rebajas rebeca rebelde rebeldes
rebeldia rebelion rebeliones rebote rebotes recabar recado recae recaer recaida recalcar recalco recamara recambio
recarga recargar recargo recauda recaudacion recaudado recaudar recaudo recayo recelo recepcion recepcionista receptor
receptores recesion receso receta recetas rechace rechaza rechazada rechazadas rechazado rechazados rechazamos rechazan
rechazando rechazar rechazaron rechazo reciba reciban recibas recibe reciben recibes recibi recibia recibian recibida
recibidas recibido recibidos recibiendo recibiera recibieron recibimiento recibimos recibio recibir recibira recibiran
recibiras recibiria recibiste recibo recibos reciclado reciclaje reciclar recien reciente recientemente recientes
recinto recintos recio recipiente recipientes reciproca reciprocidad recital recitales recitar reclama reclamaba
reclamaban reclamacion reclamaciones reclamado reclaman reclamando reclamar reclamaron reclame reclamo reclamos recluido
reclusion reclusos recluta reclutado reclutados reclutamiento reclutar reclutas recobrar recoge recogen recoger recogia
recogida recogidas recogido recogidos recogiendo recogieron recogio recoja recojo recoleccion recolectar recolectores
recoleta recomendable recomendacion recomendaciones recomendada recomendadas recomendado recomendados recomendamos
recomendando recomendar recomendaria recomendaron recomendo recomienda recomiendan recomiendas recomiendo recompensa
recompensado recompensas reconciliacion reconfortante reconoce reconocemos reconocen reconocer reconocera reconoces
reconoci reconocia reconocible reconocida reconocidas reconocido reconocidos reconociendo reconocieron reconocimiento
reconocimientos reconocio reconozca reconozcan reconozco reconquista reconsiderar reconstruccion reconstruido
reconstruir reconversion recopila recopilacion recopilado recopilados recopilar record recordaba recordad recordada
recordado recordados recordamos recordando recordar recordara recordaran recordare recordaremos recordaron recordatorio
recorde recordemos recordo records recorre recorren recorrer recorria recorrido recorridos recorriendo recorrieron
recorrio recorta recortado recortar recorte recortes recrea recreacion recrear recreativa recreativas recreativo recreo
recta rectangular rectangulo rectas rectificacion rectificar rectitud recto rector rectora rectores rectoria rectos
recuadro recuento recuerda recuerdan recuerdas recuerde recuerden recuerdes recuerdo recuerdos recupera recuperacion
recuperada recuperado recuperados recuperamos recuperan recuperando recuperar recuperaron recupere recuperen recupero
recurre recurren recurrente recurrentes recurrido recurriendo recurrio recurrir recurso recursos redaccion redactada
redactado redactar redacto redactor redactores redada rededor redencion redentor redes redistribucion redonda redondas
redondo redondos reduccion reducciones reduce reducen reducida reducidas reducido reducidos reduciendo reducir reducira
reduciria reducto redujeron redujo redundancia reduzca reduzcan reedicion reeleccion reelecto reelegido reembolso
reemplaza reemplazada reemplazado reemplazados reemplazando reemplazar reemplazo reencarnacion reencuentro reescribir
reestructurar referencia referencias referendo referendum referente referentes referia referian referida referidas
referido referidos referimos referir refiera refiere refieren refieres refiero refinada refinado refinamiento refineria
refinerias refiriendo refirio refleja reflejaba reflejada reflejado reflejados reflejan reflejando reflejar refleje
reflejo reflejos reflexion reflexiona reflexionando reflexionar reflexiones reflexiva reflexivo reforestacion reforma
reformada reformado reformar reformas reformista reformistas reforzada reforzado reforzando reforzar reforzo refran
refrescante refrescar refresco refrescos refrigeracion refrigerador refuerza refuerzan refuerzo refuerzos refugiado
refugiados refugio refugios refutar regadio regala regalado regalan regalando regalar regalaron regale regalias regalo
regalos regar regazo regencia regeneracion regenerar regente reggae regia regido regidor regidores regimen regimenes
regimiento regimientos regio region regional regionales regiones regir regis registra registrada registradas registrado
registrador registrados registran registrando registrar registraron registre registren registro registros regla
reglamentacion reglamentaria reglamentario reglamento reglamentos reglas regocijo regresa regresaba regresaban regresado
regresamos regresan regresando regresar regresara regresaria regresaron regresas regrese regresen regreses regresion
regresiva regreso regula regulacion regulaciones regulada reguladas regulado regulador reguladora reguladores regulados
regulan regular regulares regularidad regularizacion regularizar regularmente regule rehabilitacion rehabilitar rehacer
rehen rehenes rehuso reia reian reid reido reimos reina reinado reinante reinar reinas reiniciar reinicio reino reinos
reinsercion reir reis reitera reiterada reiteradamente reiteradas reiterado reitero reivindica reivindicacion
reivindicar reja rejas rejilla relacion relaciona relacionada relacionadas relacionado relacionados relacionan
relacionar relacione relaciones relaja relajacion relajada relajado relajante relajar relampago relampagos relata
relatan relatar relativa relativamente relativas relatividad relativo relativos relato relator relatos relegado
relevancia relevante relevantes relevo relevos relieve relieves religion religiones religiosa religiosamente religiosas
religiosidad religioso religiosos reliquia reliquias rellena rellenar rellenas relleno rellenos reloj relojes relucir
remanente remar remarcar remarco remata rematar remate remates remediar remedio remedios remera remeras remesas remision
remite remitente remitido remitio remitir remito remo remocion remodelacion remolacha remolino remolque remonta
remontada remontan remontar remordimiento remordimientos remos remota remotamente remotas remoto remotos remover
removido remuneracion remuneraciones remunerado remunerados renacentista renacer renacimiento renal renales rencor
rencores rendicion rendido rendimiento rendimientos rendimos rendir rendon rene renegar renglon reno renombrado renombre
renovable renovables renovacion renovada renovado renovador renovando renovar renovo renta rentabilidad rentable
rentables rentas renueva renuevan renuncia renunciado renuncian renunciando renunciar renunciaron renuncias renuncie
renuncio reojo reorganizacion reorganizar reos repara reparacion reparaciones reparado reparar reparo reparos reparte
reparten reparticion repartidas repartido repartidor repartidos repartiendo repartieron repartio repartir reparto repasa
repasando repasar repaso repatriacion repechaje repeler repensar repente repentina repentinamente repentino repercusion
repercusiones repercute repertorio repetia repeticion repeticiones repetida repetidamente repetidas repetido repetidos
repetimos repetir repetira repetitivo repita repitan repite repiten repitiendo repitieron repitio repito repleta repleto
repletos replica replicar replicas replico reponer reporta reportado reportados reportaje reportajes reportan reportando
reportar reportaron reporte reportera reportero reporteros reportes reporto reposar reposicion repositorio reposo
reposteria represa represalia represalias represas representa representaba representaban representacion representada
representadas representado representados representamos representan representando representante representantes
representar representara representaria representaron representativa representativas representativo representativos
represente representen represento represion represiva represivas represivo reprime reprimida reprimido reprimidos
reprimir reproche reproches reproduccion reproducciones reproduce reproducen reproducida reproducido reproduciendo
reproducir reproductiva reproductivos reproductor reproductores reptil reptiles republica republicana republicanas
republicano republicanos republicas repudio repuesto repuestos repugnante repugnantes repulsion repunte reputacion
requeria requerian requerida requeridas requerido requeridos requerimiento requerimientos requerir requerira requeriria
requiera requieran requiere requieren requirio requisito requisitos resaca resalta resaltan resaltando resaltar resalto
resbala rescata rescatada rescatado rescatados rescatar rescate rescates rescato resentido resentidos resentimiento
reserva reservada reservadas reservado reservados reservar reservas reserve reses resfriado resguardar resguardo reside
residen residencia residencial residenciales residencias residente residentes residia residir residual residuales
residuo residuos resignacion resina resista resiste resisten resistencia resistencias resistente resistentes resistido
resistiendo resistieron resistio resistir resolucion resoluciones resolver resolvera resolviendo resolvieron resolvio
resonancia resorte resortes respalda respaldada respaldado respaldan respaldar respaldo respecta respectiva
respectivamente respectivas respectivo respectivos respecto respeta respetable respetables respetada respetado
respetados respetamos respetan respetando respetar respete respeten respeto respetos respetuosa respetuosamente
respetuoso respetuosos respira respiraba respiracion respiran respirando respirar respiratoria respiratorias
respiratorio respiratorios respiro resplandor responda respondan respondas responde respondemos responden responder
respondera respondes respondi respondia respondido respondiendo respondieron respondio respondiste respondo
responsabilidad responsable responsables respuesta respuestas resta restablecer restablecido restan restante restantes
restar restauracion restaurada restaurado restaurante restaurantes restaurar restitucion restituir resto restos
restriccion restricciones restrictiva restrictivas restringe restringida restringido restringir resucitado resucitar
resucito resuelta resueltas resuelto resueltos resuelva resuelvan resuelve resuelven resuena resulta resultaba resultado
resultados resultan resultando resultante resultantes resultar resultara resultaria resultaron resulte resulten resulto
resume resumen resumenes resumida resumidas resumido resumiendo resumir resurgimiento resurgir resurreccion reta retablo
retaguardia retardo retencion retenciones retener retenido retenidos retiene retienen retina retira retirada retiradas
retirado retirados retiran retirando retirar retiraron retire retiren retiro retiros reto retoma retomando retomar
retomo retorcida retorcido retorica retorna retornar retorno retos retransmision retrasa retrasada retrasado retrasados
retrasar retraso retrasos retrata retratado retratar retrato retratos retrete retribucion retribuciones retro retrocede
retroceder retroceso retrospectiva retuvo reuna reunan reune reunen reunia reunian reunida reunidas reunido reunidos
reuniendo reunieron reunificacion reunimos reunio reunion reuniones reunir reunira reuniran reutilizacion revancha
revela revelacion revelaciones revelada revelado revelador revelan revelando revelar revelaron revele revelo reventa
reventar reverencia reverendo reversa reversible reverso revertir reves revestimiento revienta revisa revisada revisado
revisados revisamos revisan revisando revisar revisaron revise revisen revision revisiones reviso revista revistas
revive revivir revocacion revocar revocatoria revocatorio revolucion revolucionaria revolucionarias revolucionario
revolucionarios revoluciones revolver revuelo revuelta revueltas revuelto revueltos revuelve reyes reza rezaba rezan
rezando rezar rezo rezos riachuelo rial rias ribas ribeiro ribera riberas rica ricas rice rico ricos ridicula ridiculas
ridiculo ridiculos riego rieles rien rienda riendas riendo riera rieron ries riesgo riesgos riesgoso rifa rifle rifles
rige rigen rigida rigidas rigidez rigido rigidos rigor rigurosa rigurosamente riguroso rigurosos rima rimas rincon
rincones rinda rindan rindas rinden rindiendo rindieron rindio ring ringo rinoceronte rioja rios riqueza riquezas risa
risas risco rita ritmica ritmo ritmos rito ritos ritual rituales rival rivales rivalidad rivalidades rivera rizado rizos
roba robaba robada robadas robado robados roban robando robar robaron robas robaste robe roben robin robinson roble
robledo robles robo robos robot robotica robots robusta robusto roca rocas roce roces rocha roche rocio roda rodado
rodajas rodaje rodando rodante rodar rodas rodea rodeaba rodeaban rodeada rodeadas rodeado rodeados rodean rodeando
rodear rodearon rodeo rodeos rodilla rodillas rodo rodrigo rodrigues rodriguez roedores rogamos rogando rogar rogo roja
rojas rojizo rojo rojos rola rolando roldan roles rollo rollos romana romanas romance romances romano romanos romantica
romanticas romanticismo romantico romanticos romeria romero romo rompa rompan rompas rompe rompecabezas rompen romper
rompes rompi rompia rompiendo rompieron rompimiento rompio rompiste rompo ronca ronda rondando rondas rondon ropa ropas
ropero rosa rosada rosado rosados rosal rosales rosario rosas rosca rose rosen roses rostro rostros rota rotacion rotas
roto rotonda rotos rotunda rotundamente rotundo rotura rouge royo roza rozando rozas rubi rubia rubias rubio rubios
rublos rubro rubros ruda rudo rueda ruedas ruedo ruego rufian rugby ruido ruidos ruidosa ruidoso ruidosos ruin ruina
ruinas rule ruleta rumana rumano rumanos rumba rumbo rumbos rumor rumorea rumores rupias ruptura rural rurales rusa ruso
rustica rustico ruta rutas rutina rutinaria rutinario rutinas sabado sabados sabana sabanas sabe sabeis sabemos saben
saber saberes sabes sabia sabiamente sabiamos sabian sabias sabido sabiduria sabiendas sabiendo sabina sabino sabio
sabios sable sables sabor saborear sabores sabotaje sabotear sabra sabran sabras sabre sabremos sabria sabrias sabrosa
sabroso saca sacaba sacaban sacada sacadas sacado sacados sacamos sacan sacando sacar sacara sacaran sacaria sacaron
sacas sacaste sacerdocio sacerdotal sacerdote sacerdotes saciar saciedad saco sacos sacra sacramento sacramentos
sacrifica sacrificado sacrificados sacrificar sacrificio sacrificios sacristia sacro sacude sacudida sacudido sacudio
sacudir safari saga sagas sagitario sagrada sagradas sagrado sagrados sagrario sala salada saladas salado salados
salamanca salame salarial salariales salario salarios salas salcedo salchicha salchichas saldar saldo saldos saldra
saldran saldre saldremos saldria saldrian sale salen sales salga salgado salgamos salgan salgas salgo sali salia
saliamos salian salida salidas salido salidos saliendo saliente salientes saliera salieran salieron salimos salina
salinas salio salir saliste salitre saliva salle salmo salmon salmos salomon salon salones salsa salsas salta saltaba
saltado saltan saltando saltar saltaron salte salten salto saltos salubridad salud saluda saludable saludables saludamos
saludan saludando saludar saludo saludos salva salvacion salvada salvado salvador salvadores salvados salvaguardar
salvaje salvajes salvamento salvan salvando salvar salvara salvaron salvas salvavidas salve salven salvo sama samba
samuel samurai sana sanar sanas sanatorio sancho sancion sanciona sancionada sancionado sancionados sancionar sanciones
sanciono sandalias sandia sandinista saneamiento sangra sangrado sangrando sangrar sangre sangria sangrienta sangrientas
sangriento sangrientos sanguinea sanguineo sanguineos sanidad sanitaria sanitarias sanitario sanitarios sano sanos sant
santa santas santiago santidad santisima santisimo santo santos santuario santuarios sapo sapos saque saqueado
saqueadores saqueando saquear saquearon saquemos saquen saqueo saqueos saques sarampion sarcasmo sarcastica sarcastico
sardina sardinas sargento sarmiento sarten sastre satan satanas satelital satelitales satelite satelites satira satirica
satirico satisfaccion satisface satisfacen satisfacer satisfactoria satisfactorio satisfecha satisfechas satisfecho
satisfechos saturacion saturada saturado saturno sauce sauces saudi sauna savia sazon scooter seais seamos sean seas
seca secado secar secas seccion secciones secesion seco secos secrecion secreta secretamente secretaria secretariado
secretarias secretario secretarios secretas secreto secretos secta sectarios sectarismo sectas sector sectores sectorial
sectoriales secuaces secuela secuelas secuencia secuencias secuestra secuestrada secuestrado secuestrador secuestradores
secuestrados secuestran secuestrar secuestraron secuestro secuestros secular seculares secundaria secundarias secundario
secundarios seda sede sedes sedicion sedimentos seduccion seduce seducir seductor seductora sega segmento segmentos
segregacion seguia seguian seguid seguida seguidamente seguidas seguido seguidor seguidora seguidores seguidos
seguimiento seguimos seguir seguira seguiran seguiras seguire seguiremos seguiria seguirian seguis segunda segundas
segundo segundos segura seguramente seguras seguridad seguro seguros seis seiscientos seleccion selecciona seleccionada
seleccionadas seleccionado seleccionador seleccionados seleccionar selecciones selecciono selecta selectiva selectividad
selectivo selectivos selecto sella sellada sellado sellados sellar sello sellos selva selvas semaforo semaforos semana
semanal semanales semanalmente semanario semanas semantica sembrado sembrando sembrar sembro semejante semejantes
semejanza semejanzas semestre semestres semifinal semifinales semilla semillas seminario seminarios sena senado senador
senadora senadores sencilla sencillamente sencillas sencillez sencillo sencillos senda sendas senderismo sendero
senderos sendos senil senior seno sensacion sensacional sensacionalista sensaciones sensata sensatez sensato
sensibilidad sensibilidades sensibilizacion sensibilizar sensible sensibles sensor sensores sensorial sensoriales
sensual sensuales sensualidad sentaba sentada sentadas sentado sentados sentamos sentar sentaron sente sentencia
sentenciado sentenciados sentencias sentencio sentia sentian sentido sentidos sentimental sentimentales sentimiento
sentimientos sentimos sentir sentira sentiran sentiras sentiria sentis sentiste sento sepa sepamos sepan separa
separacion separada separadas separado separados separan separando separar separaron separatismo separatista
separatistas separe separen separo sepas septentrional septiembre septima septimo sepulcro sepultado sepultura seque
sequedad sequia sequias sequito sera seran seras serbia serbio serbios sere seremos serena serenata serenidad sereno
seres seria serial seriamente seriamos serian serias serie seriedad series serio serios sermon sermones serna serpiente
serpientes serra serrania serrano servia servian servicio servicios servida servido servidor servidores servidumbre
servilleta servilletas servimos servir servira serviran serviria sesamo sesenta sesgada sesgo sesion sesiones sesos
setas setecientos setenta setiembre sets seudonimo severa severamente severas severidad severo severos sevillana
sevillano sexenio sexismo sexista sexta sexto sheriff sicario sicarios sida sido sidra siembra siembran siemens siempre
sien siendo sienta sientan sientas siente sienten sientes siento sierra sierras siervo siervos siesta siete sifilis siga
sigamos sigla siglas siglo siglos significa significaba significacion significado significados significan significante
significar significara significaria significativa significativas significativo significativos significo signifique signo
signos sigo siguen sigues siguiendo siguiente siguientes siguiera siguieran siguieron siguio silaba silabas silenciar
silencio silencios silenciosa silenciosamente silencioso silenciosos silicio silicona silla sillas sillon sillones silo
silos silueta siluetas silva silvestre silvestres sima simbolica simbolicamente simbolicas simbolico simbolicos
simbolismo simboliza simbolo simbologia simbolos simetria similar similares similitud similitudes simio simios simon
simpatia simpatias simpatica simpatico simpaticos simpatizante simpatizantes simple simplemente simples simplicidad
simplificacion simplificado simplificar simplista simposio simula simulacion simulaciones simulacro simulador simulando
simular simultanea simultaneamente simultaneas simultaneo sinagoga sincera sinceramente sinceras sinceridad sincero
sinceros sincronizacion sindical sindicales sindicalismo sindicalista sindicalistas sindicato sindicatos sindico
sindrome sinfin sinfonia sinfonica single singles singular singulares singularidad siniestra siniestro siniestros
sinnumero sino sinodo sinonimo sinonimos sinopsis sinsentido sintaxis sintesis sintetica sintetico sinteticos sintetizar
sintiendo sintiera sintieron sintio sintoma sintomas sintonia sinverguenza sinverguenzas sionismo sionista siquiera
sirena sirenas sirios sirvan sirven sirviendo sirvienta sirviente sirvientes sirviera sirvieron sirvio sismica sismo
sismos sistema sistemas sistematica sistematico sistemica sita sitio sitios sito situa situacion situaciones situada
situadas situado situados situan situar situo soberana soberania soberano soberanos soberbia soberbio sobornar soborno
sobornos sobra sobrado sobran sobrante sobras sobrecarga sobredosis sobrellevar sobremanera sobrenatural sobrenaturales
sobrenombre sobrepasa sobrepasado sobrepasan sobrepasar sobrepeso sobres sobresale sobresalen sobresaliente
sobresalientes sobresalir sobretodo sobrevalorado sobrevive sobreviven sobrevivido sobreviviendo sobreviviente
sobrevivientes sobrevivieron sobrevivio sobrevivir sobria sobriedad sobrina sobrino sobrinos sobrio socia sociable
social socialdemocrata sociales socialismo socialista socialistas socializacion socializar sociedad sociedades socio
sociocultural sociologia sociologico sociologo sociologos socios socorro soda sodio sofa sofisticada sofisticadas
sofisticado sofisticados sofocar soga sois soja sola solamente solana solano solar solares solas soldado soldados
soldadura sole soleado soledad solemne solemnemente solemnidad solemos soler soles solia soliamos solian solicita
solicitaba solicitada solicitadas solicitado solicitados solicitamos solicitan solicitando solicitante solicitantes
solicitar solicitaron solicite soliciten solicito solicitud solicitudes solida solidaria solidarias solidaridad
solidario solidarios solidas solidez solido solidos solista solita solitaria solitarias solitario solitarios solito solo
solos solsticio soltado soltando soltar soltaron soltera solteras soltero solteros solto soltura soluble solucion
soluciona solucionado solucionan solucionar solucione soluciones solvencia solventar solvente sombra sombras sombrero
sombreros sombria sombrio somete someten someter sometida sometidas sometido sometidos sometimiento sometio somo somos
sonaba sonado sonando sonar sonara sonda sondeo sondeos sonido sonidos sono sonora sonoras sonoro sonoros sonrei sonreia
sonreir sonrie sonriendo sonriente sonries sonrio sonrisa sonrisas sopa sopas sopla soplar soplo soporta soportaba
soportado soportan soportando soportar soporte soportes soporto soprano sorbo sorda sordo sordos soriano soros sorprenda
sorprende sorprenden sorprendente sorprendentes sorprender sorprendera sorprenderia sorprendida sorprendido sorprendidos
sorprendieron sorprendio sorpresa sorpresas sortear sorteo sorteos sosa sospecha sospechaba sospechan sospechar
sospechas sospecho sospechosa sospechosas sospechoso sospechosos sosten sostener sostenga sostengo sostenia sostenian
sostenible sostenibles sostenida sostenido sostenidos sosteniendo sostiene sostienen sostuvieron sostuvo sota sotano
soto sovietica sovieticas sovietico sovieticos soya spot sprint suave suavemente suaves suavidad suavizar suba suban
subas subasta subastas subcampeon subconsciente subdesarrollo subdireccion subdirector subditos sube suben subes
subestimar subgrupo subi subia subian subida subidas subido subidos subiendo subiera subieron subimos subio subir subira
subire subiste subita subitamente subjetiva subjetividad subjetivo sublevacion sublime submarino submarinos subo
suboficial subordinacion subordinada subordinado subordinados subraya subrayado subrayar subrayo subsahariana
subsecretaria subsecretario subsidiaria subsidiarias subsidio subsidios subsiguiente subsiguientes subsistencia
subsistir subsuelo subte subteniente subterranea subterraneas subterraneo subterraneos subtitulada subtitulado subtitulo
subtitulos suburbio suburbios subvencion subvenciones subversion subversivo subversivos subyace subyacente subyacentes
succion suceda sucedan sucede suceden suceder sucedera sucederia sucedia sucedido sucediendo sucediera sucedieron
sucedio sucesion sucesiones sucesivamente sucesivas sucesivo sucesivos suceso sucesor sucesores sucesos sucia sucias
suciedad sucio sucios sucursal sucursales suda sudadera sudafricana sudafricano sudamericana sudamericano sudamericanos
sudando sudar sudeste sudoeste sudor suecos suegra suegro suegros suela sueldo sueldos suelen sueles suelo suelos suelta
sueltan sueltas suelte suelten sueltes suelto sueltos suenan suero suerte suertes sueter suficiente suficientemente
suficientes sufijo sufra sufragar sufragio sufragios sufran sufre sufren sufres sufria sufrian sufrida sufridas sufrido
sufridos sufriendo sufrieron sufrimiento sufrimientos sufrimos sufrio sufrir sufrira sufriran sufro sugerencia
sugerencias sugeria sugerido sugerir sugiere sugieren sugiero sugiriendo sugirieron sugirio suite suizos sujecion sujeta
sujetador sujetando sujetar sujetas sujeto sujetos sula sulfato sultan suma sumado sumamente sumamos suman sumando sumar
sumario sumaron sumas sume sumen sumerge sumergida sumergido sumida sumido suministra suministrada suministrado
suministrados suministrar suministro suministros sumisa sumision sumiso sumo supe supera superaba superacion superada
superado superados superan superando superar superara superaron superavit supere superen superficial superficiales
superficie superficies superintendente superior superiores superioridad supermercado supermercados supero superposicion
supersticion supersticiones supervisa supervisar supervision supervisor supervisores supervivencia superviviente
supervivientes supiera supieran supieras supieron supiese supimos supiste suplemento suplementos suplente suplentes
suplica suplico suplir supo supondra supondria supone suponemos suponen suponer suponga supongamos supongo suponia
suponiendo suposicion suposiciones suprema supremacia supremo supresion suprimido suprimir supuesta supuestas supuesto
supuestos supuse supuso surco surcoreana surcoreano surcos sureste surf surge surgen surgido surgiendo surgieron
surgimiento surgio surgir surjan suroeste surrealismo surrealista surrealistas surtido susana susceptible susceptibles
suscita suscitado suscito suscribir suscripcion suscripciones suscriptores suscrito suscritos suso susodicho suspende
suspenden suspender suspendida suspendidas suspendido suspendidos suspendieron suspendio suspense suspension
suspensiones suspenso suspira suspiro suspiros sustancia sustancial sustanciales sustancialmente sustancias sustantivo
sustantivos sustenta sustentable sustentan sustentar sustento sustitucion sustituida sustituido sustituidos sustituir
sustituto sustitutos sustituye sustituyendo sustituyo susto sustrato susurro susurros sutil sutiles sutileza sutilmente
sutura suya suyo taba tabaco tabasco taberna tabla tablas table tablero tableros tableta tabletas tablon tabu tacha
tacito taco tacon tacones tacos tactica tacticas tactico tactil tacto tailandes tailandesa tajada tajante tala taladro
talante talco talento talentos talentosa talentoso talentosos tales talibanes talla tallado tallas talle taller talleres
tallo tallos talon talones talvez tamales tamara tambien tambo tambor tambores tamil tampoco tanda tanga tangente
tangible tangibles tango tanque tanques tanta tantas tanto tantos tapa tapada tapado tapan tapar tapas tape tapete tapia
tapiz tapon tapones taquicardia taquilla tara tarado tarados tarda tardado tardan tardando tardanza tardar tardara
tardaria tardaron tardas tarde tardes tardia tardio tardo tarea tareas tarifa tarifas tarima tarjeta tarjetas tarot
tarragona tarro tarta tartaros tartas tasa tasas tata tate tato tatuado tatuaje tatuajes tauro tauromaquia taxi taxis
taxista taxistas taza tazas tazon teatral teatrales teatro teatros techo techos tecla teclado teclados teclas tecnica
tecnicamente tecnicas tecnico tecnicos tecnologia tecnologias tecnologica tecnologicas tecnologico tecnologicos tedioso
teja tejada tejado tejados tejas tejer tejido tejidos tela telas tele telediario teleferico telefonia telefonica
telefonicas telefonico telefonicos telefono telefonos telegrafo telegrama telegramas telenovela telenovelas telescopio
teleton televidentes televisa television televisiones televisiva televisivas televisivo televisivos televisor
televisores tell telon tema temario temas tematica tematicas tematico tematicos temblando temblar temblor temblores teme
tememos temen temer temerario temeroso temerosos temes temia temian temible temido temiendo temo temor temores
temperamento temperatura temperaturas tempestad templado templarios temple templo templos tempo temporada temporadas
temporal temporales temporalmente temprana tempranas temprano tempranos tena tenacidad tenaz tendemos tendencia
tendencias tender tendida tendido tendiendo tendientes tendio tendra tendran tendras tendre tendreis tendremos tendria
tendriamos tendrian tendrias tene tenebroso tened tenedor tenedores teneis tenemos tenencia tener tenes tenga tengais
tengamos tengan tengas tengo tenia teniamos tenian tenias tenido teniendo teniente tenis tenista tenor tenorio tensa
tension tensiones tenso tentacion tentaciones tentaculos tentado tentador tentar tentativa tenue teologia teologica
teologico teologo teologos teorema teoria teorias teorica teoricamente teoricas teorico teoricos tequila terapeuta
terapeutica terapeuticas terapeutico terapeuticos terapia terapias tercer tercera terceras tercero terceros terciaria
terciario tercio terciopelo tercios terco teresa termales termas termica termicas termico termina terminaba terminaban
terminacion terminaciones terminada terminadas terminado terminados terminal terminales terminamos terminan terminando
terminar terminara terminaran terminaria terminaron terminas terminaste termine terminemos terminen termines termino
terminologia terminos termo termometro terna ternera ternura terrateniente terratenientes terraza terrazas terremoto
terremotos terrenal terreno terrenos terrestre terrestres terrible terriblemente terribles territorial territoriales
territorio territorios terror terrorismo terrorista terroristas tertulia tertulias tesis tesoreria tesorero tesoro
tesoros test testamento testificar testigo testigos testimonial testimonio testimonios testosterona tetona textil
textiles texto textos textual textuales textura texturas tias tibetano tibia tibio tiburon tiburones tico ticos tics
tiembla tiemblan tiempo tiempos tienda tiendas tiende tienden tiendo tiene tienen tienes tierna tiernas tierno tiernos
tierra tierras tifon tigre tigres tijera tijeras tilde timbre time timida timidez timido timidos timo timon tina
tinieblas tino tinta tintas tinte tintes tinto tios tipa tipica tipicas tipico tipicos tipo tipografia tipologia tipos
tira tiraba tiraban tirada tiradas tirado tirador tiradores tirados tiramos tiran tirando tirania tirano tiranos
tirantes tirar tiraron tiras tiraste tire tiren tires tiro tiroides tiron tiros tiroteo tiroteos titanes titanio titere
titeres tito titula titulacion titulada titulado titulados titular titulares titularidad titulo titulos tiza toalla
toallas tobillo tobillos toca tocaba tocaban tocada tocado tocador tocados tocamos tocan tocando tocar tocara tocaria
tocaron tocas tocino toco toda todavia todo todopoderoso todoterreno toga togo tolera toleran tolerancia tolerante
tolerantes tolerar toma tomaba tomaban tomada tomadas tomado tomados tomamos toman tomando tomar tomara tomaran tomare
tomaremos tomaria tomaron tomas tomaste tomate tomates tome tomemos tomen tomes tomo tomos tonalidad tonalidades
tonelada toneladas tonica tono tonos tonta tontas tonteria tonterias tonto tontos topa topado tope topes topico topicos
topo topografia toque toquen toques toracica torax torbellino torcer torcida torcido toreo torero toreros tormenta
tormentas tormento torna tornado torneo torneos tornillo tornillos torno toro toros torpe torpedo torpedos torpes
torpeza torre torrente torreon torres torso torta tortas tortilla tortillas tortuga tortugas tortura torturado
torturados torturar torturas tosca toscana tostada tostadas tostado total totales totalidad totalitario totalitarios
totalitarismo totalmente tour toxica toxicas toxicidad toxico toxicos toxina toxinas traba trabaja trabajaba trabajaban
trabajadas trabajado trabajador trabajadora trabajadoras trabajadores trabajamos trabajan trabajando trabajar trabajara
trabajaran trabajaremos trabajaron trabajas trabaje trabajemos trabajen trabajes trabajo trabajos trabas traccion tracto
tractor tractores tradicion tradicional tradicionales tradiciones traduccion traducciones traduce traducen traducida
traducidas traducido traducidos traducir traductor traductora traductores tradujo traduzca trae traemos traen traer
traera traeran traeria traes traficante traficantes trafico traga tragado tragar tragedia tragedias tragica tragico
tragicos trago tragos traia traian traicion traiciona traicionado traicionar traiciones traiciono traida traido traidor
traidora traidores traidos traiga traigan traigas traigo trailer traje trajeron trajes trajo trama tramas tramitacion
tramitar tramite tramites tramo tramos trampa trampas trampolin tramposo tramposos trance tranquila tranquilamente
tranquilas tranquilidad tranquiliza tranquilizar tranquilo tranquilos transaccion transacciones transbordador
transcripcion transcripciones transcurre transcurrido transcurrio transcurrir transcurso transeuntes transferencia
transferencias transferida transferido transferidos transferir transfiere transforma transformacion transformada
transformado transformador transforman transformando transformar transformaron transforme transformo transfusion
transgenicos transicion transiciones transitar transito transitoria transitorio transmision transmisiones transmisor
transmita transmite transmiten transmitida transmitidas transmitido transmitidos transmitiendo transmitio transmitir
transnacional transnacionales transparencia transparente transparentes transporta transportaba transportado
transportador transportados transportan transportando transportar transporte transportes transportistas transversal
transversales tranvia tranvias trapo trapos tras trascendencia trascendental trascendente trascender trascendio
trasciende trasera traseras trasero traseros trasfondo traslada trasladada trasladado trasladados trasladan trasladar
trasladaron traslado traslados traspasa traspasado traspasar traspaso trasplante trasplantes traste trastorno trastornos
trata trataba trataban tratada tratadas tratado tratados tratamiento tratamientos tratamos tratan tratando tratar
tratara trataran tratare trataremos trataria trataron tratas tratase trate tratemos traten trates trato tratos trauma
traumas traumatica traumatico traumatismo traves travesia travesti travestis travesura travesuras traviesa travieso
trayecto trayectoria trayectorias trayendo traza trazado trazar trazas trazo trazos trebol trece trecho tregua treinta
tremenda tremendas tremendo tremendos tren trenes trenza trenzas trepar tres trescientos trial triangular triangulo
triangulos triatlon tribal tribales tribu tribuna tribunal tribunales tribunas tribus tributacion tributaria tributarias
tributario tributarios tributo tributos tricolor tridimensional trigo trilogia trimestral trimestre trinchera trincheras
trinidad trio tripa tripas triple triples tripoli tripulacion tripulantes triste tristemente tristes tristeza tristezas
triunfa triunfado triunfador triunfal triunfante triunfar triunfo triunfos trivial triviales trofeo trofeos trompa
trompadas trompas trompeta trompetas tronco troncos trono tronos tropa tropas tropezar tropezo tropical tropicales
tropico tropieza tropiezo troy troyanos trozo trozos trucha truchas truco trucos true trueno truenos trueque
tuberculosis tuberia tuberias tubo tubos tuerca tuercas tuerto tulio tumba tumbado tumbar tumbas tumor tumores tumulto
tunel tuneles tunica turba turbia turbina turbinas turbio turbo turbulencia turcas turcos turismo turista turistas
turistica turisticas turistico turisticos turno turnos turquesa tutela tutor tutores tutoria tuve tuviera tuvieramos
tuvieran tuvieras tuvieron tuviese tuviesen tuvimos tuviste tuvo tuya tuyo ubica ubicacion ubicaciones ubicada ubicadas
ubicado ubicados ubican ubicar ubico ucrania ucraniana ucraniano ucranianos ulcera ulceras ultima ultimamente ultimas
ultimatum ultimo ultimos ultra ultraderecha ultramar ultras ultravioleta umbilical umbral unan unanime unanimidad unas
undecimo unen unes unia unica unicamente unicas unico unicornio unicos unida unidad unidades unidas unido unidos uniendo
uniera unieron unificacion unificada unificado unificar uniformados uniforme uniformemente uniformes uniformidad
unilateral unimos unio union uniones unir unira uniran unisono unitaria unitario unitarios universal universales
universalidad universalmente universidad universidades universitaria universitarias universitario universitarios
universo universos unos uranio urbana urbanas urbanismo urbanistica urbanistico urbanizacion urbanizaciones urbano
urbanos urbe urge urgencia urgencias urgente urgentemente urgentes urna urnas uruguaya uruguayo uruguayos usaba usaban
usada usadas usado usados usamos usan usando usar usara usaran usaremos usaria usaron usas usaste usemos usen uses usos
ustedes usual usuales usualmente usuaria usuario usuarios usurpacion usurpador utensilios utero util utiles utilice
utilicen utilidad utilidades utiliza utilizaba utilizaban utilizacion utilizada utilizadas utilizado utilizados
utilizamos utilizan utilizando utilizar utilizara utilizaran utilizaron utilizas utilizo utopia utopico uvas vaca
vacacional vacaciones vacante vacantes vacas vacia vaciado vaciar vacias vacio vacios vacuna vacunacion vacunas vacuno
vaga vagabundo vagabundos vagamente vagancia vagando vagar vagas vago vagon vagones vagos vaina vainas vainilla vais
vajilla valdivia valdra valdria vale valen valencia valenciana valenciano valencianos valentia valentina valentino valer
vales valga valgo valia valida validacion validar validas validez valido validos valiente valientes valieron valija
valio valiosa valiosas valioso valiosos valla vallas valle valles valor valora valoracion valoraciones valorada valorado
valorados valoramos valoran valorar valores valorizacion valoro vals value valvula valvulas vamos vampiro vampiros vana
vandalismo vandalos vanguardia vanguardista vanidad vano vanos vapor vapores vaquero vaqueros vara varados varas vargas
varia variabilidad variable variables variacion variaciones variada variadas variado variados varian variando variante
variantes variar varias variedad variedades varilla varillas varios varita varon varones varonil vasallo vasallos vascos
vascular vasculares vaselina vasija vasijas vaso vasos vasta vasto vaticano vaya vayamos vayan vayas veamos vean veas
veces vecina vecinal vecinales vecinas vecindad vecindario vecino vecinos vector vectores veda vega vegano vegas
vegetacion vegetal vegetales vegetariana vegetariano vegetarianos vehemencia vehicular vehiculo vehiculos veia veiamos
veian veias veinte veintena veinticinco veinticuatro veintidos veintiocho veintiseis veintisiete veintitres veintiun
veis vejez vejiga vela velada velar velas velero vello velo veloces velocidad velocidades velorio veloz vemos vena
venado venados venas vence vencedor vencedores vencen vencer venceremos vencida vencido vencidos venciendo vencieron
vencimiento vencio venda vendan vendas vende vendedor vendedora vendedores vendemos venden vender vendera vendes vendi
vendia vendian vendida vendidas vendido vendidos vendiendo vendieron vendimia vendio vendo vendra vendran vendras
vendria vendrian veneno venenos venenosa venenosas venenoso venerable veneracion venerado venezolana venezolanas
venezolano venezolanos venga vengadores vengan venganza vengar vengas vengo veni venia veniamos venian venid venida
venidas venideros venido venimos venir venta ventaja ventajas ventana ventanales ventanas ventanilla ventas vente
ventilacion ventilador ventiladores ventura vera veracidad veran verano veranos veras veraz verbal verbales verbalmente
verbena verbo verbos verdad verdadera verdaderamente verdaderas verdadero verdaderos verdades verde verdes verdugo
verdugos verdura verduras vere vereda veredas veredicto vereis veremos vergonzosa vergonzoso verguenza veria veriamos
verian verias verifica verificacion verificada verificado verificando verificar verifique verja vero veronica veros
versa versatil versatilidad verse versiculo version versiones verso versos verte vertebral vertebras vertedero verter
vertical verticales verticalmente vertice vertido vertidos vertiente vertientes vertigo vesicula vestia vestian
vestibulo vestida vestidas vestido vestidos vestiduras vestigio vestigios vestimenta vestimentas vestir vestuario
vestuarios veta vetar vete veterano veteranos veterinaria veterinario veterinarios veto viabilidad viable viables
viaducto viaja viajaba viajaban viajado viajamos viajan viajando viajar viajara viajaron viajas viaje viajen viajero
viajeros viajes viajo vial viales vialidad vias viaticos vibora viboras vibra vibracion vibraciones vibrante vibrar
vicario vicepresidencia vicepresidenta vicepresidente viceversa viciado vicio vicios vicioso victima victimas victor
victoria victoriano victorias victoriosa victorioso vida vidas vidente video videoclip videojuego videojuegos videos
vidriera vidrio vidrios vieira vieja viejas viejita viejo viejos viendo viene vienen vienes viento vientos vientre
vieran vieras viernes vieron vierte viese vietnamita vietnamitas viga vigas vigencia vigente vigentes vigesima vigesimo
vigia vigila vigilada vigilado vigilan vigilancia vigilando vigilante vigilantes vigilar vigilia vigor viles villa
villancicos villano villanos villar villas vimos vinagre vincula vinculacion vinculada vinculadas vinculado vinculados
vinculan vinculante vincular vinculo vinculos vine viniendo viniera vinieran vinieron vinilo vinimos viniste vino vinos
viola violan violando viole violen violencia violencias violenta violentamente violentas violento violentos violeta
violetas violin violines violinista violo viral virales virgen virgenes virginia virginidad virreinato virrey virtual
virtuales virtualmente virtud virtudes virtuoso viruela virus visa visado visas visceral visibilidad visibilizar visible
visiblemente visibles vision visionario visiones visita visitaba visitada visitado visitados visitamos visitan visitando
visitante visitantes visitar visitara visitaron visitas visite visiten visito visor vispera visperas vista vistas
vistazo viste visten vistes vistiendo vistio visto vistos visual visuales visualizacion visualizar visualmente vita
vital vitales vitalicia vitalicio vitalidad vitamina vitaminas vito vitoria vitrina viuda viudas viudo viva vivamos
vivan vivas vive viven vivencia vivencias viveres vivero viveros vives viveza vivi vivia viviamos vivian vivida vividas
vivido vividos vivienda viviendas viviendo viviente vivientes viviera vivieron vivimos vivio vivir vivira viviran
viviras viviremos viviria vivis viviste vivo vivos vizconde vocablo vocabulario vocacion vocacional vocal vocales
vocalista vocero voceros voces volaba volado volador voladora voladores volando volante volantes volar volaron volatil
volatilidad volcado volcan volcanes volcanica volcanicas volcar volco voleibol volo voltaje voltea voltear voltios
volumen volumenes voluntad voluntades voluntaria voluntariado voluntariamente voluntarias voluntario voluntarios
volvamos volvemos volver volvera volveran volveras volvere volveremos volveria volverian volves volvia volvian volviendo
volviera volvieran volvieron volvimos volvio volviste vomitando vomitar vomito vomitos vosotras vosotros vota votacion
votaciones votada votado votados votamos votan votando votante votantes votar votara votaran votare votaria votaron vote
votemos voten votes voto votos vuelan vuelca vuelco vuele vuelo vuelos vuelta vueltas vuelto vuelva vuelvan vuelvas
vuelve vuelven vuelves vuelvo vuestra vuestras vuestro vuestros vulgar vulgares vulgaridad vulnerabilidad vulnerable
vulnerables vulneracion xenofobia yace yacen yacimiento yacimientos yale yang yanqui yanquis yardas yate yates yegua
yema yemas yenes yerba yerno yeso yodo yoga yogur yuan yuca yugo zacatecas zafar zafra zaga zambrano zanahoria
zanahorias zanja zapata zapatero zapatilla zapatillas zapato zapatos zarate zarzuela zeta zetas zinc zocalo zodiaco
zombi zombis zona zonas zoologico zorro zorros zumbido zumo zurda zurdo zurdos zurita
`;

  const PANGRAMAS = `
abdomen abiertas abierto abolicion abrieron abrimos absoluta absoluto abstracto absurdo abuelos abundancia abundante
aburrido academias academicas academico accesible accesibles accesorios accidente acciones accionista accionistas
acelerado aceptable aceptadas aceptado acercando acertado acierto aclaracion aconseja aconsejo acordes acreditar
acreedores activacion activado activos actores actrices actuacion actuales actualidad actualiza actuando actuaron
acueducto acuerdan acuerdas acuerdo acumulado acusacion acusando adecuados adelantado adelantar adelanto adelgazar
adentro adicional adictos adjunto admision admiten adopcion adoptaron adorable adoracion adquiere adquirido adquirio
adrenalina adultos adversos advertir advierte advirtio aerolinea aeropuerto afectadas afectado aficionado afiliacion
afiliados afirmado africanas africano agencias agitacion agradable agradeceria agradecida agregados agregando agresiva
agricola agujero agustin ajustado alarmante albergue albumes alcanzado alcanzando alcanzaron alcoholicas alegando
alegrias alejados alfabeto alfombra alguien algunos alicante aliento alimenta alimentan alineacion allegados almacenar
almacenes alquiler alrededores alterado aluminio alumnado alumnos alusion amablemente amarillos ambicion ambicioso
ambiente ambitos amenazado amenazando americana amigable amistades ampliado amplios analizado analizando anecdota
anfitrion angelica angulos angustia animados animales anochecer anomalias antecedentes anteojos anterior anticipacion
anticipada antiguas antiguo antologia antorcha anualmente anulacion anunciado anunciando anunciaron anuncios aparecian
aparecio aparentemente aparezcan aparicion apariencia apartados apasionada apasionado apellido apendice aplaudir
aplicable aplicacion aplicadas aplicado aplique aportando aportes apostando apostoles aprecian aprecio aprendes aprendi
apretado aprobadas aprobados apropiacion apropiadas apropiados aproxima aprueban apuesto apuntado apuntando apuntes
aquellos aragones aranceles arbitraje arbitros arboles arbustos archivo ardiendo ardiente arequipa argentina
aristocracia armamento armenio arrastrando arreglado arreglos arrepentir arrestado arrestados arrestaron arrogancia
arrogante artefacto artesanal artesanales artesania artesanos articular artificial artistico artisticos ascendencia
ascendente ascender ascension ascensor asciende asegurada aseguran aseguro asesinado asesinados asesinaron asesinato
asesinatos asiento asientos asignacion asignado asignados asistencia asistencias asociaciones aspecto aspectos asquerosa
asqueroso asumido asuncion atencion atendido atendiendo atendio atentados aterrizaje atletico atraccion atractivas
atractivo atrapados atraveso atraviesa atropello atuendo audicion audiencia auditoria auditorio aumentada aumentar
aumentara aumento ausencia autentica autismo autobuses automatica automatico autonomas autonomia autonomos autopista
autopistas autopsia autores autoridad autoriza autorizar autorizo auxilios avanzados avenidas aventura averigua
averiguar aviones ayudamos ayudante ayudaron bacteria bailando bailarinas bancarias bancario bancarrota banderas
bandidos banquete barriles basurero baterias belgica bendicion bendiga bendita bendito benefica beneficencia beneficia
benefician beneficio benjamin bernardo bicicleta bienvenida bienvenido bilateral bilingue billetera billones biografia
biologica biologicos blancos bloquea bloqueos bloques bodegas boletas boletin boliche bolivar boliviana boliviano
bombardeo bonaerense bonitas borrachos botanico botellas boxeador brigadas brigadier brindando britanica brujeria
bruselas budista budistas bulgaro burguesa burocracia buscado buscamos buscarla busqueda busquedas caballeria caballero
cabellos cabildo cadaveres cafeteria cajones calentar calibre calienta caliente calificacion calificado callejero
callejon calorias caluroso calvario cambiado cambiamos cambien cambies cambios caminando caminos camiseta camisetas
campeon campeona canadiense canadienses cancelacion cancelado canciller cancilleria canciones candidatas candidato
capacidades capacitacion capacitado capitalista capitalistas capitolio capricho captacion capturas capturo
caracteristica caracteristicas caracteriza caramelo cardenal cardenas carencias cargados cargando caricaturas carnicero
carolina carriles carteles castellana castigar castigo castigos castillo castillos casting casualidad catalanes catedral
catolicos caudillo causando causante causaron cayendo cayeron celebrada celebran celestial celulares cenizas censura
censurar centavo centenares centrada central centros cercanias cercanos cerebrales cerrados cerramos cerrando certamen
cervezas chantaje chaqueta charles chilena chileno chimenea chingada chiquita chiquito chocolate choques cicatrices
cientifica cientifico cientos ciertas ciertos cifrado cigarrillo cigarros cilindro cincuenta cineasta cintura cinturon
circuitos circulan circulos cirugias citados citando ciudadanas ciudadano ciudadela ciudades civilizada clasificada
clasificar clerigo clientela clientes climaticas climatico cobarde cobardia cobrando codificacion coeficiente cofradia
cogiendo coherente cohesion coincidencia colaborado colaborador colecciones colectivo colegas colegios colesterol
colgando colinas colonias colonizacion columna comandos combate combina combinacion combinan comedia comenta comentan
comercios cometas cometido comidas comiendo comienzo comieron comillas comisaria comisario comisiones comiste comites
comparada comparado comparan comparta comparto competente compite complace complejo completo complica complice
componente componer comporta composicion comprado comprador compramos compran compraron compras compren comprobar
compromete comprometer compromiso compromisos comunal comunas comunes comunica comunicacion comunican comunismo
comunmente concebido concebir concedida concejal concentra concentran concentrar conceptos concierto conciliar concluido
concluir conclusion concluye concordia concreta concretar concretos condenados condenar condenas condesa condicional
condiciones conducia conduciendo conducir conducta conductor conectada conectado conectar conexiones confesion
confesiones confiado confiando confianza confiar confieso confirmo conflicto conforma conforman conformar conforme
confunde confunden confundido confusa confusion congreso congresos conjunta conjuntos conlleva conmemora conmemorar
conocidas conociera conocimiento consciencia consciente conscientes consecucion consecuente consejero consejeros consiga
consigan consigna consignas consiguio consiste consisten consistente consistia constancia constante constantes constatar
constitucion constructor consuelo consume consumen contadas contador contados contagio contaminacion contamos
contencioso contenedor contenga contenia contenido contesta contextos continentes contingente continua continuacion
continuan continue continuen continuos contraccion contraer contraria contrario contrasta contratacion contratada
contratado contratos controla controlan controlar contundente convencido convenciones convenga conveniencia conveniente
convenios convicciones convincente convirtio convivencia convocados conyuge coordinacion coordinado coordinador
coordinadora coordinar cordial cordobes cordones coreanos corporacion correcciones correctas corregido corridas
corriendo corriente corrupcion corrupta corruptos cortadas cortando corteza cortina costera costillas cotidiana
cotidiano cotizacion creacion creadores creados creamos creando creativa creciendo crecientes credito creencias creyendo
creyentes criados criaturas crimenes criminal cristal cristiana cristianas cristina criterios criticado cronicas
crueldad cruzadas cruzado cruzaron cuadrados cuadros cuantos cuarenta cuarentena cuaresma cuartel cuarteto cuartos
cubanos cuchillos cuentas cuentos cuerdas cuernos cuerpos cuestan cuidados cuidadoso cuidando culmino culpable cultiva
cultivo culturas cumbres cumplan cumplen cumplia cumplio cumplir curacion curiosa daremos debatir deberian deberias
debieran debieron debilidades decepcion decidieron decidimos decimos decision decisiones decisiva decisivo declaraba
declarado declaran declaro decretos dedicacion dedicados defectos defensor defensores deficiencia deficiente definicion
definidas definidos dejamos dejaron delantera delegados delfines delicadeza delicado delicias delicioso deliciosos
delitos demasiado demasiados demencia demonios demostro demuestre denomina denominada denominado dentista denuncia
denuncian denuncio dependencia dependientes deportes deposito depositos deprimido derechas derechos derivadas derivado
derivan derribado derrotas desafiar desafio desafios desalojo desaparece desaparecer desarrolla desarrollada
desarrolladas desarrollado desarrollados desarrollar desarrolle desarrollo desarrollos descansar descanso descarga
descargar descargas descaro descarta descartar descendencia descendiente descendientes desconocido desconocidos
descontento describe describir descubre descuido desempleo desenlace desesperado desesperados deshacer desierto designa
designada designo despegar despejado despejar despertar desperto despierte destacado destacados destacan destacar
destaco destina destinada destinadas destino destinos destituido destreza destruir destruye desviar deteccion detectives
detencion detenidas detenidos determine devocion devuelta devuelto devuelvan diabetes diablos diagonal dialogar dialogos
diamante dibujar dibujos diccionario diciembre dictador dictadura diecinueve diferente dificiles difunto difusion
digamos dijeron dimension dimensiones dinamicas dinamico dinamismo diploma diputado direccion directa directo director
directorio directrices diremos dirigente dirigiendo dirigieron discurso discursos discusion discute discutido discutir
disfraz disgusto disminuido disminuir disparado disparan disparo disparos dispersos dispone disponen disponia
disposicion dispositivo dispositivos disputa disputas distancia distancias distante distantes distincion distintivo
distorsion distraer distribuir diversa diversas diversidad diverso diversos divertida divertido dividendos divisiones
doblaje docenas docencia docentes doctoral doctores dolares dominacion dominar domingos dominicana dominicano donantes
doncella doquier dormitorios dotacion dramatica durante echamos echando echaron eclesiastica ecologia ecologica
ecologicos economia economica economicos ecuacion ecuador ediciones edificios editora editores educador educados
efectiva efectivo efectuar eficientes egipcios egoista egresados ejecucion ejecutada ejecutar ejemplar ejemplos
ejercicios ejercida ejercido ejercito elaborada elaborado elecciones electoral electores electrica electrico elefantes
elegancia elegantes elegidos elegimos elementales elementos elevados eligiendo eligieron eliminada eliminar embajadas
embarazada embarazo embargo embarque emergentes emisora emisoras emitidos emitiendo emociona emociones empanadas
emperador empezado empezamos empezaste empiezan empiezas empleadas empleado emprendedor empujar enamorada enamorado
encabezada encabezo encantado encantaria encargada encargo encarnacion encerrado encontrar encontrara encontraran
encontraron encuentra encuentran encuentres encuentro encuesta encuestas enemigas enemigos energias enfermas enfermedad
enfermeras enfermeria enfermos enfocada enfocado enfocar enfoques enfrentaron enmiendas enojados enriquecer entendemos
entendieron entendimiento enterado enterrado entidades entiendas entradas entrado entrando entregada entregaron entregas
entrenado entrenador entrenando entretenida entretenido entretenimiento entusiasta entusiastas enviadas enviado enviando
enviaron envuelta envuelto equipaje equipos equivale equivoco erroneamente erudito escalon escalones escapado esclavo
esclavos escobar escogido escolar escolares escolta escombros esconder escondido escondidos escopeta escoria escriba
escriben escribia escribio escribiste escribo escrita escritas escrito escritor escritores escritorio escritos escuadra
escuchaba escuchan escuchar escuchaste esencial esenciales esfuerza esfuerzo esfuerzos eslogan esmeralda espacial
espaciales espacio espacios espantoso especial especiales especifica especificas especifico especificos espectro
esperaban esperado esperamos esperanza esperanzas espinosa espiral espiritu espiritus esponja espontanea espontaneo
esqueleto esquina esquinas estabamos establece estadio estadios estadistica estadisticas estancia estancias estandar
estandares estandarte estando estanque estaremos estarian estereotipo estereotipos estigma estimada estiman estimar
estomago estragos estrategia estrategias estrecha estrechas estrecho estrechos estricta estrictas estricto estructura
estructuras estudia estudio estudios estudiosos eternidad etiquetas etnicos euforia europeas evasion eventual evidencia
evidentemente evidentes evitado exactamente exactos exagerado examinar excelencia excelentes excepcion excesiva excesivo
excluir exigencia exigiendo exigimos exiliado existan existian existido existiera exitosa exitosas expediente expertos
explica explico explique explora explorar explota exponiendo exportar expresada expresan expuesta expuestas expuesto
expuestos extendida extendido extendiendo extendio extension extensiones exteriores externas externos extincion extracto
extranjera extremas extremos fabrican fabricas fabuloso faciles facilitan facilitar facturas facultad facundo fallecio
faltando faltaron fanatico fantastica farmacias farmacos fascinacion fascismo favorece favorecer favores favorita
favorito federales federico felicidad felicito femeninas femeninos feminismo fenomenal feriado ferroviaria ferroviario
festejar festivo festivos fiables fichaje figuran figuras fijacion filipinas filosofica filtros finales finalista
finalistas finalizar finalizo financiado financiera firmado firmaron firmemente firmeza fiscales fisiologia flechas
flexibles florida flotando flotante fluidez fluidos fomenta formaban formadas formados formando formatos formula
formular fortuna forzados fotografia fotografos fracasado fraccion fracturas frances francesa francesas franceses
francisca francos fraudes frecuente frontal frontera fuertemente fuerzas fumando funciona funcionan funcione fundador
fundadora fundicion funeral furiosa gabinete galardon galardonado galerias galindo ganaderia garantias garantiza
garantizar gasolina gastando gelatina generado generador generales generando generica generico generosa genetica
genetico geniales genocidio geografia gerencia gestion gestiones gigantes gilbert gimnasio ginebra girando gitanos
globales gloriosa glucosa gobernar gobierno goleador golpeado golpear grabados grabando graciosa graciosas gracioso
graciosos graduados graficas grafico gramatica grandes grandeza granito gratitud gratuitas gratuito gremios grietas
guantes guardando guarderia guardian guardias guayaquil guerrilla guerrillero guiones guitarras guitarrista gustaban
gustado gustaria habiamos habiles habitante habitos habitual hablabamos hablamos hablando hablaron hacemos haciamos
hacienda haitianos hallazgos hambruna haremos hectareas helados hembras hepatitis hercules herencia heridas heridos
hermanas hermandad hermano hermosa hermosas heroica hicieran hicieron hidalgo hierbas higienico hincapie hipotesis
hispano hispanos historia historias historico historicos hogares hoguera hombres homenaje homicidios homofobia honesta
honorarios hormiga hormigon hormonas horrible hostiles hubiera hubiesen huelgas humanidad humanos humildad humilde
hungaro hurtado huyendo huyeron identica identico identidades ideologia ideologico ignorado ignorancia ignorando iguales
ilimitado iluminar ilusiones ilustra ilustrar ilustre ilustres imagenes imaginacion imaginado imaginando imaginario
imbeciles imitacion impacto imparcial imperial impidiendo implicaba implican implicar imponente imponer imponiendo
importa importar importe imposicion impresa impreso impresos impulsa impulso impulsos impunidad inaugural inauguro
incapaces incendios incentivo incidentes incierto incluida incluido inclusion incluso incluya incluye incluyen incluyo
incomoda incomodidad incondicional inconsciente inconveniente incorpora incorporacion incorporan incorporar incorrecto
increible incursion independencia independientes indicador indicaron indiferente indigenas indignacion individual
individuos indonesia indulto infanteria infantes infarto infecciones inferiores infernal infidelidad infinitamente
inflacion inflexion influido influye influyen informa informan informar informaron informe infraccion ingenieros inglesa
inglesas ingrediente ingresa ingresar ingreso ingresos inhumano iniciales iniciativas injerencia injusta injusto
inmediata inmediatamente inmersion inmoral inmueble innecesaria innegable innovador innovadora inocentes inquieta
inquietante inquietud inquilinos inquisicion inscripcion inscrito inscritos insecto insectos insercion insistencia
insistiendo inspeccion inspirada instalada instalar instalo institucion insular insulta insulto insultos integra
integran integrante integrar inteligentes intenciones intendencia intensamente intensidad intensiva intensivo intentado
intentando intentaron interesa interesan interesante interesantes interesar intereso interiores internamente internas
internos interpreta interpretar interpretes interpreto intervino intestinal intoxicacion inundacion inutiles invasiones
invencible inventar inventor inventos inversa inversion inversiones inversor inversores invisible invisibles invitacion
invitado invitaron irracional irregular irreversible islamico italianos itinerario jacinto japones japonesa japonesas
japoneses jefatura jerarquia jeronimo jesuitas jornadas joyeria judicial jugador jugamos jugando jugaron juntaron
jupiter jurados juridica juridico juristas justicia juvenil juventud juzgado laborales laboratorio labores lacteos
ladrillos lagrimas lamentable lamentablemente lamentar lamento lastimar latinos lecciones lechuga lectora lectores
lectura legalizar legalmente legitima legitimo lejanos lenguaje lenguas lentitud lesbiana lesbianas leucemia levantada
levantar levanto leyendas liberada liberales liberan librerias libreta licenciada licencias licitacion liderado ligados
ligeras ligeros limitadas limitado limpieza linares linterna liquidar liquidez liquidos listado literarias literario
literatura llamativo llegados llegamos llegando llegaron lleguemos llevados llevamos llevando llevaron lloviendo
localizacion localizada localizado localizar locuras logramos logrando loteria luchado lugares luminoso lunares machismo
machista madurez maduros maestria maestro maestros magdalena magicos magnifica majestad maldito malestar maligno
malvados mandatos manejado manejando maniobra mantendra mantenemos mantengo mantenimiento mantuvo manuales mapuche
maquinaria maquinas maravillas marcados marcando marcharon margenes marginal maridos marihuana marinero marines marinos
mariposa mariposas mariscal mariscos marques marquesa marrones marroqui martillo martires marxismo marxista marxistas
matadero matematicas matematico material materias materno matices matones matrimonio mayonesa mayores mayorias
mayoritaria mayoritario mayusculas mecanicas mecanico mediados medianas mediano mediante mediatica medicas medicina
medicion medicos medieval mediocre meditar mejillas mejorada mejorado mejoran mejoras mejoria melodia memorable memorial
memorias menciona mencionan menciones mensual mensuales mentales mentira mercadeo mercaderia mercado mercancia mercurio
merecido merienda meritos metafora metalica metidos metiendo metieron mexicana mezclada mezclan mezclar mezclas
microfono miembros mientas migratoria migratorio milagro militancia militante millonario millones mineral mineras
mineros miniatura ministra ministro ministros minorias mintiendo minutos mirando misionero misioneros misterio misterios
misterioso mitologia mobiliario mochila modales moderados moderna modernos modesta modifica modificada modificado
molesta molestas monarcas monedas monopolios monstruo monstruos montaje monterrey monumentos morales moralidad mosquito
mosquitos mostraba mostrado mostrador mostraron motivada motivado motivar moviendo moviles movilidad movimiento
muchachos muertas muertos muestra muestras muestren muestro multiple mundial municipio murales murieron muscular musical
musulmanes nacidos nacieron nacionalidad nacionalizacion naciones naciste narices nativos navegando navidades necesaria
necesarias necesidad necesidades necesita necesitan necesitas necesito negacion negativa negligencia negociacion
negocios nervios nervioso nerviosos neuronas neutral nicaragua nitrogeno nobleza nocturna nocturnos nombrada nombrado
nombres nominados noruega notable noticias noticiero notificacion novedades novelas nublado nuclear nucleos nuestra
nuestras nuestro nuestros nuevamente numeros numerosos nutricion nutrientes obesidad obispado objecion objetivo obligada
obligado obligan obligar observa observar obstante obtencion obtenga obtenido obteniendo ocasional ocasiones occidente
ochenta octubre ocultan ocultar ocultas ocupacion ocupadas ocupados ocupando ocuparon ocurrida ocurridos ocurriera
ocurrieron ofensivo ofertas oficinas ofrecemos ofrecia ofrecido ofrecieron ofrenda ofrezca olimpica olimpicos olvidaba
olvidados olvidan olvidando olvidar olvidas olviden olvides omnibus opcional opciones operadores operando oportuna
oposiciones opositora opositores opresion optimista opuesta opuestas ordenadores ordenados ordenanza ordinarios organica
organico organiza organizan organizar organizaron organizo orgullosa orientar origenes originado original originarios
ortografia pabellon paciente padrino palacios palmeras panaderia pandemia pandillas paquetes paradigma paraguayo
paralelos parametro parasito parasitos parcelas parecian parecida parecio parezcan parezco pariente parques parroquia
participan participe participo partidario partidas partido pasajero pasajeros pasaporte pasaportes paseando pasiones
pastoral pastores patetico patologia patriarcal patricio patriotas patriotica patriotico patronal patrullas peatonal
peatones pecados pedagogia pedazos pedimos pegados pegando peinado peleando pelicula peligro pelotas pendientes
penitencia pensado pensamos pensando pensaria pensaron percepcion perciben perdemos perdidas perdidos perdiendo
perdieron perdiste perdona perdonado perdonar perfecta perfecto perfiles perfumes perimetro periodico periodos peritos
permanece permanecen permanecer permanecera permanente permanentemente permiso permisos permita permiten permitia
permitiera permitio permitira permitiria permito perseguir persigue persistente persona personas perteneciente
pertinentes peruanas peruano pesadilla pesadillas pescado pescados pesimista petalos peticion petrolera petroleros
picante pidieron piedras pierdan pierdas piernas pilares pimienta pinches pintadas pintado pintando pintura pionera
pioneros piramide pistola pistolas placeres planeado planeando planetas planteada plantear planteo plastica plasticas
platillos platino plenamente pluralidad poblados pobreza poderosa poderosas podiamos podremos podrian podrias poetica
polemico policias politica politicos pondria ponencia pongamos portadas portatil portavoz portuaria porvenir posgrado
posible posibles posiciones positiva positivas postales posterior posteriores postula postura posturas potable potestad
practican practicas practico precariedad precedente precios precioso preciosos precisa precisas preciso precisos
predecesor predicar prefecto preferentemente preferible preferida preferido pregunte pregunten premios premisa premisas
prendas prendio preocupa preocupar preocupen preocupes preparados preparando preparatoria presenta presentan presentar
presentara presentaran presento presidida presidido presion presiones prestan presumir presupuesto presupuestos
pretendes pretendo previas previos primarios primavera primeras primeros primitiva primitivo principal principes
principios prisionero prisioneros prisiones privacidad privadas privado probable probando proceda proceden procedio
procesar proclama proclamo procurador produce producido producir producto productor profesora profeta profundo
programada programado programador programas progresar prohibe prohibido promedio promesa promesas prometedor prometen
prometi prometio promocion promotores promovido promueve pronuncio propaganda propiedad propietaria propietario
proponemos proponiendo proporciona proporcionan proporcionar proposicion propuesto propuestos protectora protectores
protegen proteja protesis protesta protestar protestas protocolos provecho proveedores proviene provienen provision
provocada provocado provocan provocaron proxima proximos proyecto prudente prueban pruebas psicologico psicologicos
psicologo psicologos psicopata publica publico publique pudiendo pudiera pudiesen pudimos pudiste pueblos puertas
puertos pulgadas pulsera puntaje puntero pusiera quebrada quedaban quedando quedaran quedaria quedaste quemado queremos
querian querias querida querido quiebra quieran quieras quijote quilombo quimicas quimicos quincena quirurgica quisiera
quisieras quitado raciales racional racismo radiacion radiante rapidez rapidos ratifico ratones razones reaccion
reacciona reaccionar reacciono realicen realidades realista realistas realizaba realizada realizan realizaran realizo
realmente rebeldia rebelion recepcion receptores recesion rechazada rechazan rechazo reciban recibian recibida recibido
recibieron recibiran recibos reciclaje recientemente recientes recinto recipiente recital reclaman reclamo reclutar
recogido recoleccion recolectar recomendo reconocemos reconocido reconociendo reconozca recordaba recordando recordemos
recorridos recorriendo recreacion rectificar recuento recuerdan recuerdas recuerdos recurrentes redactado redactor
redencion reducida reducido reeleccion reemplaza reemplazar referencia referendum referidas referidos reflejada reflejan
reflejos reformado reformas reforzado refuerzos refugio regalado regalaron regalos regidores regimenes regiones registra
registrar registro registros regresado regresaron regulan regulares reinado relajado relativa relatos relevante religion
religioso religiosos remedios remonta rendicion renovada renovado rentable renuncia renunciar renuncio repentina
repentino repetido replica reportado reportaje reportan represalias representa representan representante representantes
representar represento represion reproduce repudio repuesto repuestos requerida requerido resalto reservado reservados
residente residentes residuos resolvio respalda respaldar respecta respecto respetan respetuoso responde responden
responder respondes respondo respuesta respuestas restaurante restaurantes restringir resuelto resueltos resuelva
resuelven resulta resultar resultara resulto retablo retencion retirado retiraron retorica retrasado reunido reuniendo
reuniones revancha revelado revisada revision revisiones revista revistas revuelta rezando ridicula ridiculo riendas
rincones riqueza rivales rodillas romance rompieron rotacion sabiduria sabotaje sabremos sacrificio sacrificios sacudio
saliente saltando saludable saludables salvador salvando salvaron sancionado sancionar sanciones sanitario sanitarios
santiago satisface saturno secretaria secuencia secuencias secuestrar secuestro secuestros secular seducir segmento
segmentos seguian seguida seguidas seguido seguidos seguimos seguira seguiria segunda segundas segundo segundos
seleccion selecciones semaforo semaforos semejante semejantes semejanza senador senadora senadores sencilla sencillas
sencillez sencillo sencillos sensacion sensaciones sentado sentados sentencia sentencias sentido sentidos sentimiento
sentimientos sentimos sentira sentiras sentiria separado separados separaron separatistas septima septimo serenidad
seriamos serpiente serpientes servicio servicios servido servidor servidores serviran setiembre siembra significa
significan significo siguiente siguientes siguiera silencio silencioso silueta silvestre silvestres simbolico similares
similitud simpatica sincera sinceras sincero sinceros sindical siniestra siniestro sintiendo sintieron sintoma sintomas
siquiera sirvieron sistematica situado situados soberana soberano soberanos soberbia sobredosis sobretodo sobrevive
sobrevivio sobrevivir sobrina sociales socialismo socialista socialistas sociedad sociedades sociologia solicita
solicite solidaria solidaridad solidario solidarios solitaria solitario soltera solteras solucion sometido sometidos
sonriendo sonriente soportan sorprende sorprender sospecha sospechas sospechosa sostenia sostenido sosteniendo sovietico
sovieticos subditos sublime subtitulos sucedera sucedia sucedido sucedio sucesion sucesivas sucesivos suciedad
sucursales sufrido sufrimos sugieren sugiero sumamente sumando sumario sumaron superada superan superior superiores
supiera supieras suplente suplentes suponer suponia suposicion suprema supremo surgido suscrito suspender suspension
sustancia sustancias sustitucion tablero tacones talentos talentoso talones tambien tanques teclado tecnicamente
tecnicas tecnicos tejidos telefonos telegrama telenovela televisa televisiva televisivo tematicas temblar temblor
temperatura templos temprana tendencia tendras tendria tendrian tentacion teologia teorias teorica teoricos tequila
tercios termica termina terminan terminar terminara terminaria termines termino terratenientes terribles territorial
terrorismo terrorista terroristas tertulia testamento testimonio testimonios tiburon tiempos tiendas tijeras tirando
titulado titularidad todopoderoso tolerante tonelada tonteria tormenta tortugas totalmente trabajado trabajador
trabajadora trabajaron trabajen trabajos traccion traduce traducida traducir traductor tradujo traemos trafico tragedia
tragico traicion trajeron tramites transito transmitir transparente transparentes transportar trasladado trasladados
traslado travesia trayecto tremenda tremendo tribuna tributario tributos trilogia tristemente tristeza triunfar triunfo
trompeta tuberia tumores turismo turistica turisticas turistico turisticos tuviera tuvimos ubicacion ubicadas ubicado
ucraniano ultimas ultimos unidades unificacion unificar unitario urbanos urgentemente urgentes uruguayos utilicen
utilizaba utilizada utilizan utilizar vacantes vacunacion vagones valencia valenciana valentia valentina validez validos
valiente valores vampiro variable variacion variados variante variedades varones vaticano vecinas vecinos vegetales
veiamos veinticinco vencedor vencida vencido vendedores vendidas vendidos vendieron vendria venezolana venezolano
venimos ventajas ventanilla ventura veracidad veranos verbales verdaderos verdugo verduras verifica verificar version
versiones vertebral vertigo vestida vestido vestidos vestigios veterano veterinaria viajando viajaron viajero viceversa
victimas victoria vientos vigencia vigentes vigesimo vigilancia villanos vinagre vincula vinculo violando violento
violeta virgenes virginidad virtual visibilidad visitado visitante visitantes vispera visperas vistazo visuales vitales
vitaminas vivencias viviendas vocales volante voltaje volumen volveran volveras volveremos volveria volviendo volviera
volvieron vomitar votacion votantes vueltas vuestra vuestras vuestro vuestros zanahoria zapatero zapatillas
`;

  const partir = (t) => t.split(/\s+/).filter(Boolean);
  global.PalabrasBee = { palabras: partir(PALABRAS), pangramas: partir(PANGRAMAS) };
})(window);
