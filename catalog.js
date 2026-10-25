/*
 * NOVA — catalog data
 * All titles below are FICTIONAL DEMO ENTRIES, not real movie links.
 * Replace them with content you own or have permission to distribute.
 *
 * video:
 *   { type: 'mp4', url: 'media/your-video.mp4' }  // hosted MP4 (H.264 + AAC recommended)
 *   { type: 'drive', url: 'https://drive.google.com/file/d/YOUR_FILE_ID/view' }
 *   null                                         // display-only listing
 *
 * Google Drive preview works only when each viewer has permission to access the file.
 */
window.NOVA_CATALOG = [
  {id:'last-signal',title:'The Last Signal',type:'movie',year:2026,age:'PG-13',length:'1h 42m',genres:['Sci-Fi','Thriller'],featured:true,tag:'FEATURED PREMIERE',description:'When every screen in the city goes dark, a late-night radio host receives one final transmission that changes everything.',art:'signal',accent:'#fb6b5b',video:{type:'mp4',url:'media/nova-demo.mp4',demo:true}},
  {id:'blue-hour',title:'Blue Hour',type:'movie',year:2025,age:'PG',length:'1h 35m',genres:['Drama','Adventure'],tag:'STAFF PICK',description:'Two siblings follow a forgotten map along the coast and find more than they set out looking for.',art:'coast',accent:'#56a7e0',video:null},
  {id:'orbit-nine',title:'Orbit Nine',type:'series',year:2026,age:'TV-14',length:'1 Season',genres:['Sci-Fi','Adventure'],tag:'NEW SERIES',description:'A repair crew aboard an aging space station starts receiving messages from a planet that should not exist.',art:'orbit',accent:'#b49cff',video:null,seasons:[{label:'Season 1',episodes:[{title:'Arrival',length:'42m'},{title:'The Quiet Side',length:'45m'},{title:'Static',length:'43m'}]}]},
  {id:'paper-kings',title:'Paper Kingdom',type:'movie',year:2024,age:'PG',length:'1h 28m',genres:['Animation','Adventure'],tag:'FAMILY FAVORITE',description:'A little artist folds a paper world into existence and accidentally brings its greatest adventure to life.',art:'paper',accent:'#eab775',video:null},
  {id:'neon-district',title:'Neon District',type:'series',year:2026,age:'TV-14',length:'2 Seasons',genres:['Mystery','Thriller'],tag:'NOIR SERIES',description:'An underground courier uncovers a secret hidden behind the city’s brightest lights.',art:'neon',accent:'#fa69bf',video:null,seasons:[{label:'Season 1',episodes:[{title:'After Midnight',length:'48m'},{title:'Red Line',length:'44m'}]},{label:'Season 2',episodes:[{title:'False Dawn',length:'51m'}]}]},
  {id:'wild-current',title:'Wild Current',type:'movie',year:2025,age:'G',length:'1h 16m',genres:['Documentary','Adventure'],tag:'NATURE',description:'An intimate journey along a wild river and the people working to protect it.',art:'current',accent:'#5dd0c7',video:null},
  {id:'midnight-frequency',title:'Midnight Frequency',type:'movie',year:2026,age:'PG-13',length:'1h 49m',genres:['Mystery','Drama'],tag:'NEW ADDITION',description:'A small-town musician discovers that the songs on an old cassette seem to predict tomorrow.',art:'frequency',accent:'#ad87ed',video:null},
  {id:'sunset-run',title:'Sunset Run',type:'movie',year:2024,age:'PG-13',length:'1h 52m',genres:['Action','Adventure'],tag:'ACTION',description:'One last delivery turns into a chase across a sun-soaked desert highway.',art:'sunset',accent:'#eaa05f',video:null},
  {id:'tiny-planet',title:'Tiny Planet',type:'series',year:2025,age:'TV-G',length:'1 Season',genres:['Animation','Comedy'],tag:'FOR EVERYONE',description:'Three miniature explorers try to solve very big problems on a very small planet.',art:'tiny',accent:'#e6ca77',video:null,seasons:[{label:'Season 1',episodes:[{title:'Welcome Home',length:'21m'},{title:'The Great Crater',length:'22m'}]}]},
  {id:'northline',title:'The North Line',type:'series',year:2024,age:'TV-PG',length:'1 Season',genres:['Drama','Mystery'],tag:'SLOW BURN',description:'Strangers on the last train of the winter begin to realize their stories are connected.',art:'north',accent:'#88c3d5',video:null,seasons:[{label:'Season 1',episodes:[{title:'Last Stop',length:'43m'},{title:'The Passenger',length:'40m'}]}]},
  {id:'good-company',title:'Good Company',type:'movie',year:2025,age:'PG',length:'1h 31m',genres:['Comedy','Drama'],tag:'FEEL GOOD',description:'A group of friends tries to save their tiny neighborhood theater with the worst business plan imaginable.',art:'company',accent:'#ffc06e',video:null},
  {id:'echo-valley',title:'Echo Valley',type:'movie',year:2026,age:'PG-13',length:'1h 44m',genres:['Mystery','Adventure'],tag:'ADVENTURE',description:'An unexpected voice from an empty valley leads a photographer deep into the mountains.',art:'valley',accent:'#77ac92',video:null}
];
