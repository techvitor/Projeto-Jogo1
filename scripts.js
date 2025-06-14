console.log("AUUU");

// ——— SPRITES & AUDIO ———
const sprites = new Image();
sprites.src = './sprites.png';

const spriteBoss = new Image();
spriteBoss.src = './boss.png';

const spriteArquibancada = new Image();
spriteArquibancada.src = './arquibancada.png';

const spritePassaro = new Image();
spritePassaro.src = './passaroNovo.png';
spritePassaro.onload = () => console.log("Passarinho carregado!");
spritePassaro.onerror = () => console.error("Erro ao carregar sprite do passarinho!");

const spriteTiro = new Image();
spriteTiro.src = './tirosPassaro.png';

const somHit = new Audio('./efeitos/efeitos_hit.wav');
const somPonto = new Audio('./efeitos/efeitos_ponto.wav');

// ——— CANVAS & ESTADO ———
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
let pausado = false;
let frames = 0;
let highScore = parseInt(localStorage.getItem('highScore')) || 0;

// ——— UTIL ———
function desenharMenuPause() {
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.font = '30px VT323';
  ctx.textAlign = 'center';
  ctx.fillText('PAUSADO', canvas.width/2, canvas.height/2 - 20);
  ctx.font = '20px VT323';
  ctx.fillText('Pressione ESC para voltar', canvas.width/2, canvas.height/2 + 20);
}

function colisao(bird, chao) {
  return (bird.y + bird.altura) >= chao.y;
}

// ——— OBJETOS ———
function criaChao() {
  const alt = 112, larg = 224;
  return {
    x: 0,
    y: canvas.height - alt,
    largura: larg,
    altura: alt,
    atualizar() { this.x = (this.x - 1) % this.largura; },
    desenhar() {
      const rep = Math.ceil(canvas.width/this.largura)+1;
      for (let i=0; i<rep; i++) {
        ctx.drawImage(sprites, 0, 610, this.largura, this.altura, this.x + i*this.largura, this.y, this.largura, this.altura);
      }
    }
  };
}

const planoFundo = {
  desenhar() {
    ctx.fillStyle = '#70c5ce'; ctx.fillRect(0,0,canvas.width,canvas.height);
    const prop = canvas.width/spriteArquibancada.width;
    const recH = canvas.height/prop;
    ctx.drawImage(spriteArquibancada, 0, spriteArquibancada.height-recH, spriteArquibancada.width, recH, 0,0,canvas.width,canvas.height);
  }
};

const telaInicio = {
  spriteX: 134, spriteY: 0, largura:174, altura:152,
  x: (canvas.width-174)/2, y:50,
  desenhar() {
    ctx.drawImage(sprites, this.spriteX,this.spriteY,this.largura,this.altura,this.x,this.y,this.largura,this.altura);
  }
};

function criaCanos() {
  const esp=90, larg=52, alt=400;
  let pares=[];
  return {
    atualizar() {
      if (frames%100===0) pares.push({ x:canvas.width, y:-150*(Math.random()+1), pontoContado:false });
      pares.forEach((p,i) => {
        p.x-=2;
        const b=globais.legendaryBird;
        const tb=b.y, bb=b.y+b.altura;
        if (b.x>=p.x && b.x<=p.x+larg) {
          if (tb<=p.y+alt || bb>=p.y+alt+esp) mudaTela(Telas.GAME_OVER);
        }
        if (!p.pontoContado && p.x+larg< b.x) { globais.placar.pontos++; somPonto.play(); p.pontoContado=true; }
        if (p.x+larg<=0) pares.splice(i,1);
      });
    },
    desenhar() {
      pares.forEach(p => {
        ctx.drawImage(sprites,52,169,larg,alt,p.x,p.y,larg,alt);
        ctx.drawImage(sprites,0,169,larg,alt,p.x,p.y+alt+esp,larg,alt);
      });
    }
  };
}

function criaBird() {
  const bird={ largura:66, altura:38, x:10, y:50, pulo:4.6, gravidade:0.2, velocidade:0,
    pula() { this.velocidade = -this.pulo; },
    atualizar() {
      if (colisao(this, globais.chao)) { somHit.play(); return setTimeout(()=>mudaTela(Telas.GAME_OVER),500); }
      this.velocidade += this.gravidade; this.y += this.velocidade;
    },
    desenhar() { ctx.drawImage(spritePassaro,this.x,this.y,this.largura,this.altura); }
  };
  return bird;
}

function criaTiros() {
  let lista=[];
  return {
    lista,
    atirar(x,y){ lista.push({x,y,velX:4,largura:64,altura:64}); },
    atualizar(){ lista.forEach((t,i)=>{t.x+=t.velX; if(t.x>canvas.width) lista.splice(i,1);}); },
    desenhar(){ lista.forEach(t=>ctx.drawImage(spriteTiro,0,0,307,1024,t.x,t.y,t.largura,t.altura)); }
  };
}

function criaBoss() {
  let fase=0, cd=0;
  return {
    x:canvas.width, y:50, largura:96, altura:256, vida:5, velocidadeX:2, velocidadeY:1.2, dirY:1, frame:0, total:4, tempo:10,
    atualizar() {
      if(fase===0){ this.x-=this.velocidadeX; if(this.x<=canvas.width-this.largura-20) fase=1; }
      else {
        this.y+=this.velocidadeY*this.dirY;
        if(this.y<=0||this.y+this.altura>=canvas.height) this.dirY*=-1;
        this.x+=Math.sin(frames/30)*1;
        cd--; if(cd<=0){ globais.tirosBoss.push({x:this.x,y:this.y+this.altura/2,velX:-4,largura:16,altura:16}); cd=100; }
      }
      if(frames%this.tempo===0) this.frame=(this.frame+1)%this.total;
    },
    desenhar() {
      const p=this.vida/5;
      ctx.fillStyle=p>0.6?'green':p>0.3?'yellow':'red';
      ctx.fillRect(this.x,this.y-10,this.vida*20,5);
      ctx.drawImage(spriteBoss,this.frame*384,0,384,1024,this.x,this.y,this.largura,this.altura);
    }
  };
}

// ——— Telas e loop ———
const globais={}, Telas={}, chum=[];
let telaAtiva={};

Telas.INICIO={
  inicializar(){ globais.chao=criaChao(); globais.legendaryBird=criaBird(); globais.canos=criaCanos(); },
  desenhar(){ planoFundo.desenhar(); globais.legendaryBird.desenhar(); globais.canos.desenhar(); globais.chao.desenhar(); telaInicio.desenhar(); },
  atualizar(){ globais.chao.atualizar(); },
  click(){ mudaTela(Telas.JOGO); }
};

Telas.JOGO={
  inicializar(){ globais.placar={ pontos:0, desenhar(){ ctx.font='35px VT323';ctx.textAlign='right';ctx.fillStyle='white';ctx.fillText(this.pontos,canvas.width-20,35);}, atualizar(){} }; },
  desenhar(){ planoFundo.desenhar(); globais.canos.desenhar(); globais.chao.desenhar(); globais.legendaryBird.desenhar(); globais.placar.desenhar(); },
  atualizar(){ globais.canos.atualizar(); globais.chao.atualizar(); globais.legendaryBird.atualizar(); if(globais.placar.pontos>=5) mudaTela(Telas.BOSS); },
  click(){ globais.legendaryBird.pula(); }
};

Telas.BOSS={
  inicializar(){ globais.boss=criaBoss(); globais.tiros=criaTiros(); globais.tirosBoss=[]; },
  desenhar(){ planoFundo.desenhar(); globais.chao.desenhar(); globais.legendaryBird.desenhar(); globais.boss.desenhar(); globais.tirosBoss.forEach(p=>{ctx.fillStyle='orange';ctx.fillRect(p.x,p.y,p.largura,p.altura)}); globais.tiros.desenhar(); },
  atualizar(){ globais.chao.atualizar(); globais.legendaryBird.atualizar(); globais.boss.atualizar(); globais.tirosBoss.forEach((p,i)=>{p.x+=p.velX;const b=globais.legendaryBird;if(p.x<b.x+b.largura&&p.x+p.largura>b.x&&p.y<b.y+b.altura&&p.y+p.altura>b.y) mudaTela(Telas.GAME_OVER); if(p.x+p.largura<0) globais.tirosBoss.splice(i,1)}); globais.tiros.atualizar(); globais.tiros.lista.forEach((t,i)=>{const bs=globais.boss; if(t.x+t.largura>=bs.x&&t.x<=bs.x+bs.largura&&t.y>=bs.y&&t.y<=bs.y+bs.altura){bs.vida--; globais.tiros.lista.splice(i,1); if(bs.vida<=0) mudaTela(Telas.VITORIA);}}); },
  click(){ globais.legendaryBird.pula(); },
  keydown(e){ if(e.code==='Space') globais.tiros.atirar(globais.legendaryBird.x+globais.legendaryBird.largura,globais.legendaryBird.y+globais.legendaryBird.altura/2); },
  mouseDown(e){ if(e.button===2) globais.tiros.atirar(globais.legendaryBird.x+globais.legendaryBird.largura,globais.legendaryBird.y+globais.legendaryBird.altura/2); }
};

Telas.GAME_OVER={ desenhar(){ planoFundo.desenhar(); globais.chao.desenhar(); globais.canos.desenhar(); globais.legendaryBird.desenhar(); ctx.fillStyle='rgba(0,0,0,0.6)';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='white';ctx.font='30px VT323';ctx.textAlign='center';ctx.fillText('GAME OVER',canvas.width/2,120);ctx.font='20px VT323';ctx.fillText(`Pontuação: ${globais.placar.pontos}`,canvas.width/2,180);ctx.fillText(`Recorde: ${highScore}`,canvas.width/2,210);ctx.fillText('Clique para jogar novamente',canvas.width/2,270); },atualizar(){}, click(){ mudaTela(Telas.INICIO);} };
Telas.VITORIA={ desenhar(){ ctx.fillStyle='black';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='white';ctx.font='30px VT323';ctx.textAlign='center';ctx.fillText('VOCÊ DERROTOU O BOSS!',canvas.width/2,canvas.height/2);},atualizar(){},click(){ mudaTela(Telas.INICIO);} };

// ——— CONTROLES & LOOP ———
function mudaTela(nova){ telaAtiva=nova; if(telaAtiva.inicializar) telaAtiva.inicializar(); }
window.addEventListener('contextmenu',e=>e.preventDefault());

window.addEventListener('keydown', e => {
  if (e.code === 'F9') { mudaTela(Telas.BOSS); return; }
  if (e.code === 'Escape') { pausado = !pausado; return; }
  if (e.code === 'Space') { if (telaAtiva.click) telaAtiva.click(); return; }
  if (telaAtiva.keydown) telaAtiva.keydown(e);
});

window.addEventListener('mousedown', e => { if (telaAtiva.mouseDown) telaAtiva.mouseDown(e); });
window.addEventListener('click', () => { if (telaAtiva.click) telaAtiva.click(); });

mudaTela(Telas.INICIO);
function loop(){ if(!pausado) telaAtiva.atualizar(); telaAtiva.desenhar(); if(pausado) desenharMenuPause(); frames++; requestAnimationFrame(loop); }
loop();
