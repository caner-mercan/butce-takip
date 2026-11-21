(function(){
  var KEY='gunluk-butce-v1';
  var CATS=[{n:'Yemek',c:'#ff6b5b'},{n:'Ulaşım',c:'#4f7cff'},{n:'Market',c:'#3fd0a0'},{n:'Fatura',c:'#ffc83d'},{n:'Eğlence',c:'#b779ff'},{n:'Sağlık',c:'#ff8fc1'},{n:'Diğer',c:'#9aa3b5'}];
  function col(n){for(var i=0;i<CATS.length;i++)if(CATS[i].n===n)return CATS[i].c;return '#9aa3b5';}
  var state={budget:2000,roll:true,expenses:[]};
  try{var raw=localStorage.getItem(KEY);if(raw){var p=JSON.parse(raw);if(p&&Array.isArray(p.expenses)){state=p;}}}catch(e){}
  if(typeof state.roll!=='boolean')state.roll=true;
  function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}}
  function $(id){return document.getElementById(id);}
  function iso(d){var m=d.getMonth()+1,g=d.getDate();return d.getFullYear()+'-'+(m<10?'0':'')+m+'-'+(g<10?'0':'')+g;}
  function parse(s){var a=s.split('-');return new Date(+a[0],+a[1]-1,+a[2]);}
  var todayKey=iso(new Date()),sel=todayKey,cat='Yemek';
  var fmt=new Intl.NumberFormat('tr-TR',{maximumFractionDigits:2});
  function money(n){return fmt.format(n)+' ₺';}
  var sums={};
  function index(){sums={};state.expenses.forEach(function(e){sums[e.date]=(sums[e.date]||0)+e.amount;});}
  function total(d){return sums[d]||0;}
  function carryFor(d){
    if(!state.roll)return 0;
    var keys=Object.keys(sums).sort();if(!keys.length||keys[0]>=d)return 0;
    var c=0,cur=parse(keys[0]),end=parse(d),n=0;
    while(cur<end&&n<400){c+=(+state.budget||0)-total(iso(cur));cur.setDate(cur.getDate()+1);n++;}
    return c;
  }
  function shift(n){var d=parse(sel);d.setDate(d.getDate()+n);sel=iso(d);render();}

  function ticks(frac,color){
    var N=60,s='',on=Math.round(frac*N);
    for(var i=0;i<N;i++){
      var a=(i/N)*2*Math.PI-Math.PI/2,c=Math.cos(a),si=Math.sin(a),long=i%5===0;
      var r1=long?100:104,r2=114;
      s+='<line x1="'+(120+c*r1).toFixed(2)+'" y1="'+(120+si*r1).toFixed(2)+'" x2="'+(120+c*r2).toFixed(2)+'" y2="'+(120+si*r2).toFixed(2)+'" stroke="'+(i<on?color:'var(--tick)')+'" stroke-width="'+(long?4:3)+'" stroke-linecap="round"/>';
    }
    $('ticks').innerHTML=s;
  }

  function render(){
    index();
    var b=+state.budget||0,carry=carryFor(sel),avail=b+carry,spent=total(sel),left=avail-spent;
    $('budget').value=b;$('roll').checked=!!state.roll;
    $('dlabel').textContent=parse(sel).toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long'});
    var frac=avail>0?Math.max(0,Math.min(1,left/avail)):0;
    var color=left<0?'var(--bad)':(frac<.2?'var(--warn)':'var(--ok)');
    ticks(left<0?1:frac,color);
    $('left').textContent=money(Math.abs(left));
    $('leftlbl').textContent=left<0?'limit aşıldı':'bugün için kaldı';
    $('spent').textContent=money(spent);$('bud').textContent=money(b);
    $('carry').textContent=(carry>0?'+':'')+money(carry);

    var ul=$('list');ul.innerHTML='';
    var items=state.expenses.filter(function(e){return e.date===sel;}).reverse();
    if(!items.length){var e0=document.createElement('li');e0.className='empty';e0.textContent='Bu güne ait harcama yok. Yukarıdan ekleyebilirsin.';ul.appendChild(e0);}
    items.forEach(function(e){
      var li=document.createElement('li');
      var d=document.createElement('span');d.className='dot';d.style.background=col(e.cat);
      var t=document.createElement('div');t.className='t';
      var s=document.createElement('span');s.textContent=e.cat;t.appendChild(s);
      if(e.note){var sm=document.createElement('small');sm.textContent=e.note;t.appendChild(sm);}
      var a=document.createElement('span');a.className='a';a.textContent=money(e.amount);
      var x=document.createElement('button');x.className='del';x.textContent='×';x.setAttribute('aria-label','Harcamayı sil');
      x.onclick=function(){state.expenses=state.expenses.filter(function(z){return z.id!==e.id;});save();render();};
      li.appendChild(d);li.appendChild(t);li.appendChild(a);li.appendChild(x);ul.appendChild(li);
    });

    var sd=parse(sel),y=sd.getFullYear(),m=sd.getMonth(),dim=new Date(y,m+1,0).getDate();
    $('mtitle').textContent=sd.toLocaleDateString('tr-TR',{month:'long',year:'numeric'});
    var cal=$('cal');cal.innerHTML='';
    ['Pt','Sa','Ça','Pe','Cu','Ct','Pz'].forEach(function(w){var h=document.createElement('div');h.className='h';h.textContent=w;cal.appendChild(h);});
    var off=(new Date(y,m,1).getDay()+6)%7;
    for(var i=0;i<off;i++)cal.appendChild(document.createElement('div'));
    var mt=0,okd=0,past=0;
    for(var dnum=1;dnum<=dim;dnum++){
      var k=iso(new Date(y,m,dnum)),t2=total(k),fut=k>todayKey;
      mt+=t2;if(!fut){past++;if(t2<=b)okd++;}
      var btn=document.createElement('button');
      btn.textContent=dnum;
      if(t2>0){var r=b>0?t2/b:2;btn.style.background=r>1?'rgba(255,107,91,.8)':'rgba(63,208,160,'+(0.25+0.6*r).toFixed(2)+')';btn.style.borderColor='transparent';}
      btn.className=(k===sel?'sel ':'')+(fut?'fut':'');
      btn.setAttribute('aria-label',dnum+' '+$('mtitle').textContent+': '+money(t2));
      (function(key){btn.onclick=function(){sel=key;render();};})(k);
      cal.appendChild(btn);
    }
    $('mtot').textContent=money(mt);
    $('mavg').textContent=money(past?mt/past:0);
    $('mok').textContent=okd+' / '+past;

    var by={},tot=0;
    state.expenses.forEach(function(e){if(e.date.slice(0,7)===sel.slice(0,7)){by[e.cat]=(by[e.cat]||0)+e.amount;tot+=e.amount;}});
    var st=$('stack'),lg=$('leg');st.innerHTML='';lg.innerHTML='';
    Object.keys(by).sort(function(a,z){return by[z]-by[a];}).forEach(function(k){
      var seg=document.createElement('div');seg.style.cssText='height:100%;background:'+col(k)+';width:'+(by[k]/tot*100)+'%';st.appendChild(seg);
      var l=document.createElement('span');var dot=document.createElement('i');dot.style.background=col(k);
      l.appendChild(dot);l.appendChild(document.createTextNode(k+' '+money(by[k])));lg.appendChild(l);
    });
  }

  var chips=$('chips');
  CATS.forEach(function(c){
    var b=document.createElement('button');b.type='button';b.className='chip';
    var d=document.createElement('i');d.style.background=c.c;b.appendChild(d);b.appendChild(document.createTextNode(c.n));
    b.setAttribute('aria-pressed',c.n===cat?'true':'false');
    b.onclick=function(){cat=c.n;Array.prototype.forEach.call(chips.children,function(x){x.setAttribute('aria-pressed','false');});b.setAttribute('aria-pressed','true');};
    chips.appendChild(b);
  });
  $('f').addEventListener('submit',function(ev){
    ev.preventDefault();
    var v=parseFloat($('amount').value);if(!(v>0))return;
    state.expenses.push({id:Date.now()+Math.random(),date:sel,amount:v,cat:cat,note:$('note').value.trim()});
    save();$('amount').value='';$('note').value='';render();$('amount').focus();
  });
  $('budget').addEventListener('change',function(){state.budget=Math.max(0,parseFloat(this.value)||0);save();render();});
  $('roll').addEventListener('change',function(){state.roll=this.checked;save();render();});
  $('prev').onclick=function(){shift(-1);};
  $('next').onclick=function(){shift(1);};
  $('today').onclick=function(){sel=todayKey;render();};
  render();
})();
