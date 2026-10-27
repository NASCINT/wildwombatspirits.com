/* Wild Wombat Spirits: shared behaviour for every page except the home page (which has its own inline copy). */
(function(){
 var $=function(s,c){return (c||document).querySelector(s)};
 var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
 var root=document.documentElement;
 var R=root.getAttribute('data-root')||'';   /* "" on pages one folder deep */

 var SP=[
  {k:'gin',n:'Gin',a:'#6f93e0'},
  {k:'limoncello-gin',n:'LimonCello Gin',a:'#e6d65a'},
  {k:'hemp-gin',n:'Hemp Gin',a:'#8fbf64'},
  {k:'coffee-liqueur',n:'Coffee Liqueur',a:'#b8946f'},
  {k:'wild-berry-vodka',n:'Wild Berry Vodka',a:'#d58ac0'},
  {k:'vodka',n:'Vodka',a:'#c28a6a'}
 ];
 window.WW={SP:SP,R:R,$:$,$$:$$};

 /* age gate */
 var blocks=[$('#top'),$('#main'),$('footer'),$('.signoff'),$('#fband')];
 function lock(on){blocks.forEach(function(b){if(!b)return;if(on)b.setAttribute('inert','');else b.removeAttribute('inert')})}
 if(!root.classList.contains('ok')){lock(true);var y=$('#age-yes');if(y)y.focus()}
 $('#age-yes').addEventListener('click',function(){try{localStorage.setItem('ww-age-ok',String(Date.now()))}catch(e){}root.classList.add('ok');lock(false)});
 $('#age-no').addEventListener('click',function(){location.href='https://www.google.com'});

 /* menu dropdowns */
 function mini(c){return '<svg viewBox="0 0 44 62" style="--b:'+c+'" aria-hidden="true"><use href="#mb"/></svg>'}
 ['wild','trav'].forEach(function(s){
  var pre=s==='wild'?'WW ':'WW Traveller ',slug=s==='wild'?'ww-':'ww-traveller-';
  var set=s==='wild'?'wild':'traveller';
  var h='<a href="'+R+(s==='wild'?'full-wild-collection.html':'traveller-collection.html')+'">'+mini('#d9c59a')+'Full Range</a>';
  SP.forEach(function(p){h+='<a href="'+R+slug+p.k+'.html">'+mini(p.a)+pre+p.n+'</a>'});
  var dd=$('.dd[data-nav='+s+']');if(dd)dd.innerHTML=h;
 });
 var burger=$('#burger'),nav=$('#nav');
 burger.addEventListener('click',function(){var o=nav.classList.toggle('open');burger.setAttribute('aria-expanded',o);burger.textContent=o?'Close':'Menu'});
 function closeAll(){$$('.menu .has').forEach(function(x){x.classList.remove('open');x.firstElementChild.setAttribute('aria-expanded','false')})}
 $$('.menu .has>button').forEach(function(b){b.addEventListener('click',function(){var li=b.parentNode,was=li.classList.contains('open');closeAll();if(!was){li.classList.add('open');b.setAttribute('aria-expanded','true')}})});
 document.addEventListener('click',function(e){if(!e.target.closest('.menu .has'))closeAll()});
 document.addEventListener('keydown',function(e){if(e.key==='Escape')closeAll()});

 /* small logo once the page scrolls */
 var top=$('#top');function onS(){top.classList.toggle('small',window.scrollY>60)}window.addEventListener('scroll',onS,{passive:true});onS();

 /* background videos play only while on screen */
 var watch;
 if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting){if(!v.src&&v.dataset.src){v.src=v.dataset.src}var p=v.play();if(p&&p.catch)p.catch(function(){})}else{v.pause()}})},{rootMargin:'200px'});
  watch=function(v){io.observe(v)};
 } else { watch=function(v){if(v.dataset.src)v.src=v.dataset.src;v.play()} }
 window.WW.watch=watch;
 $$('.lazyvid').forEach(watch);

 /* click-to-play videos */
 $$('.vbox button').forEach(function(b){b.addEventListener('click',function(){
  var v=document.createElement('video');v.src=b.dataset.v;v.controls=true;v.playsInline=true;v.autoplay=true;
  b.parentNode.appendChild(v);b.remove();v.play();
 })});

 /* section dividers: wombat tracks, brown on light ground, cream on dark ground */
 function lum(hex){var n=parseInt(hex.slice(1),16);return (0.299*(n>>16)+0.587*(n>>8&255)+0.114*(n&255))/255}
 function drawDiv(el,idx){
  var a=el.dataset.a,b=el.dataset.b,W=1440,H=64,prints='';
  var ink=lum(b)>0.55?'#512D1E':'#f3ecdc';
  var d='M0 '+H+' L0 30 C240 14 480 44 720 30 S1200 16 1440 30 L1440 '+H+'Z';
  for(var i=0;i<12;i++){var px=50+i*120,py=(i%2?50:40),rot=(i%2?100:80);prints+='<use href="#wp" x="'+(px-10)+'" y="'+(py-12)+'" width="20" height="24" transform="rotate('+rot+' '+px+' '+py+')" color="'+ink+'"/>'}
  el.innerHTML='<svg viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="xMidYMax slice" style="height:'+Math.round(H*(window.innerWidth<600?.7:1))+'px"><rect width="'+W+'" height="'+H+'" fill="'+a+'"/><path d="'+d+'" fill="'+b+'"/>'+prints+'</svg>';
  el.style.background=a;
 }
 function drawAll(){$$('.dv').forEach(function(el,i){drawDiv(el,i+1)})}
 drawAll();
 var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(drawAll,200)});
})();
