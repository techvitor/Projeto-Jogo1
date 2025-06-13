console.log("AUUU");

const sprites = new Image();
sprites.src = './sprites.png'; // Origem das imagens


const spriteBoss = new Image();
spriteBoss.src = './boss.png';


const spriteTiro = new Image();
spriteTiro.src = './tirosPassaro.png'; // use o caminho correto

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');


const somHit = new Audio();
somHit.src = './efeitos/efeitos_hit.wav'

const somPonto = new Audio();
somPonto.src = './efeitos/efeitos_ponto.wav';


let pausado = false;


function desenharMenuPause() {
    contexto.fillStyle = "rgba(0, 0, 0, 0.5)";
    contexto.fillRect(0, 0, canvas.width, canvas.height);
    contexto.fillStyle = "white";
    contexto.font = '30px "VT323"';
    contexto.textAlign = "center";
    contexto.fillText("PAUSADO", canvas.width / 2, canvas.height / 2 - 20);
    contexto.font = '20px "VT323"';
    contexto.fillText("Pressione ESC para voltar", canvas.width / 2, canvas.height / 2 + 20);
}

function criaChao(){
const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    atualizar(){
        const movimentoChao = 1;
        const repeteChao = chao.largura / 2;
        const movimentacao = chao.x - movimentoChao;
        chao.x = movimentacao % repeteChao;
    },

desenhar(){ // Função para mostrar o chão
    contexto.drawImage(
    sprites,
    chao.spriteX, chao.spriteY, // Sprite X, Sprite Y
    chao.largura, chao.altura, // Tamanho do recorte da Sprite
    chao.x, chao.y,
    chao.largura, chao.altura,
);
    contexto.drawImage(
    sprites,
    chao.spriteX, chao.spriteY, // Sprite X, Sprite Y
    chao.largura, chao.altura, // Tamanho do recorte da Sprite
    (chao.x + chao.largura), chao.y,
    chao.largura, chao.altura,
);
    }
}
    return chao;
}

function colisao(legendaryBird, chao){ // Função para calcular a colisão
    const birdY = legendaryBird.y + legendaryBird.altura;
    const chaoY = chao.y;

    if(birdY >= chaoY){
        return true;
    }
    return false;
    }


const planoFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,

desenhar(){ // Função para mostrar o plano de fundo
    contexto.fillStyle = '#70c5ce';
    contexto.fillRect(0,0, canvas.width, canvas.height)

    contexto.drawImage(
    sprites,
    planoFundo.spriteX, planoFundo.spriteY, // Sprite X, Sprite Y
    planoFundo.largura, planoFundo.altura, // Tamanho do recorte da Sprite
    planoFundo.x, planoFundo.y,
    planoFundo.largura, planoFundo.altura,
);
    contexto.drawImage(
    sprites,
    planoFundo.spriteX, planoFundo.spriteY, // Sprite X, Sprite Y
    planoFundo.largura, planoFundo.altura, // Tamanho do recorte da Sprite
    (planoFundo.x + planoFundo.largura), planoFundo.y,
    planoFundo.largura, planoFundo.altura,
);
    }
}


const telaInicio = {
    spriteX: 134,
    spriteY: 0,
    largura: 174,
    altura: 152,
    x: (canvas.width / 2) - 174 /2,
    y: 50,

desenhar(){ // Função para mostrar o chão
    contexto.drawImage(
    sprites,
    telaInicio.spriteX, telaInicio.spriteY, // Sprite X, Sprite Y
    telaInicio.largura, telaInicio.altura, // Tamanho do recorte da Sprite
    telaInicio.x, telaInicio.y,
    telaInicio.largura, telaInicio.altura,
);
    }
}


function criaCanos() {
    const canos = {
        largura : 52,
        altura : 400,
        chao: {
            spriteX: 0,
            spriteY: 169,
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        espaco: 80,
        desenhar(){ 
            canos.pares.forEach(function(par){
                const yRandom = par.y;
                const espacoCanos = 90;

                const canoCeuX = par.x;
                const canoCeuY = yRandom;
                   // [Cano do ceu]
                contexto.drawImage(
                sprites,
                canos.ceu.spriteX, canos.ceu.spriteY,
                canos.largura, canos.altura,
                canoCeuX, canoCeuY,
                canos.largura, canos.altura
            )

            const canoChaoX = par.x;
            const canoChaoY = canos.altura + espacoCanos + yRandom;
            // [Cano do chao]
            contexto.drawImage(
                sprites,
                canos.chao.spriteX, canos.chao.spriteY,
                canos.largura, canos.altura,
                canoChaoX, canoChaoY,
                canos.largura, canos.altura,
            )
            par.canoCeu = {
                x: canoCeuX,
                y: canos.altura + canoCeuY
            }
            par.canoChao = {
                x : canoChaoX,
                y: canoChaoY
            }

             })
      },
        temColisaoBird(par){
            const cabecaBird = globais.legendaryBird.y;
            const peBird = globais.legendaryBird.y + globais.legendaryBird.altura;
            if(globais.legendaryBird.x >= par.x){
                console.log("invadiu");

                if(cabecaBird <= par.canoCeu.y){
                    return true;
                }

                if(peBird >= par.canoChao.y){
                    return true;
                }
            }
            return false;
        },

        pares : [],
        atualizar(){
            const passou100Frames = frames % 100 === 0;
          if(passou100Frames){
            canos.pares.push({
            x: canvas.width,
            y: -150 * (Math.random() + 1),
             pontoContado: false
         });
}

              canos.pares.forEach(function(par) {
                 par.x = par.x - 2;

    // Verifica colisão
            if (canos.temColisaoBird(par)) {
            console.log("perdeu");
             mudaTela(Telas.GAME_OVER);
    }

    // Verifica se o bird passou o cano e ainda não contou ponto
            if (!par.pontoContado && par.x + canos.largura < globais.legendaryBird.x) {
                globais.placar.pontos += 1;
                par.pontoContado = true;
    }

    // Remove canos que saíram da tela
                if (par.x + canos.largura <= 0) {
                canos.pares.shift();
    }
});
        }
    }
    return canos;
}


function criaBoss() {
    return {
        x: 200,
        y: 0,
        largura: 96,
        altura: 256,
        vida: 5,
        velocidade: 1.5,
        frameAtual: 0,
        totalFrames: 4, // número de quadros na sprite sheet
        tempoFrame: 10, // frames por animação
        
        atualizar() {
            // Movimento horizontal
            if (this.x > canvas.width - this.largura - 20) {
                this.x -= this.velocidade;
            }

            // Atualização do frame da animação
            if (frames % this.tempoFrame === 0) {
                this.frameAtual = (this.frameAtual + 1) % this.totalFrames;
            }
        },

        desenhar() {
    // Barra de vida
    contexto.fillStyle = 'red';
    contexto.fillRect(this.x, this.y - 10, this.vida * 10, 5);

    const spriteX = this.frameAtual * 384; // 384 = largura do quadro
    const spriteY = 0;
    const larguraSprite = 384;
    const alturaSprite = 1024;

    const larguraDestino = 96; // novo tamanho visível no canvas
    const alturaDestino = 256;

    contexto.drawImage(
        spriteBoss,
        spriteX, spriteY,
        larguraSprite, alturaSprite,
        this.x, this.y,
        larguraDestino, alturaDestino
    );
}
    };
}

function criaPlacar(){
    const placar = {
         pontos: 0,
        desenhar(){
           contexto.font = '35px "VT323"';
           contexto.textAlign = "right";
           contexto.fillStyle = "white";
           contexto.fillText(`${placar.pontos}`, canvas.width - 20 , 35); 
           placar.pontos 
        },
        atualizar(){
        const intervaloDeFrames = 100;
        const passouOIntervalo = frames % intervaloDeFrames === 0;

        if(passouOIntervalo){
            placar.pontos = placar.pontos + 1;

        }
        if(passouOIntervalo){
        placar.pontos += 1;
        if (placar.pontos > highScore) {
        highScore = placar.pontos;
        localStorage.setItem("highScore", highScore);
    }
}

        }
    }
    return placar;
}

function criaBird(){
    const legendaryBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    pulo: 4.6,
    pula(){ // Função pulo do bird
        console.log("[antes]", legendaryBird.velocidade)
        legendaryBird.velocidade = - legendaryBird.pulo
        console.log("[depois]", legendaryBird.velocidade)
    },
    gravidade: 0.20,
    velocidade: 0,

    atualizar(){ 
        if(colisao(legendaryBird, globais.chao)){
            console.log("Fez colisao");
            somHit.play();

            setTimeout(() => {
                mudaTela(Telas.GAME_OVER);
            }, 500);
            
            return; 
        }
        
        
        legendaryBird.velocidade = legendaryBird.velocidade + legendaryBird.gravidade // Calculo para controlar a gravidade/velocidade
        legendaryBird.y = legendaryBird.y + legendaryBird.velocidade  
    },

      movimentos: [
      { spriteX: 0, spriteY: 0, }, // asa pra cima
      { spriteX: 0, spriteY: 26, }, // asa no meio 
      { spriteX: 0, spriteY: 52, }, // asa pra baixo
      { spriteX: 0, spriteY: 26, }, // asa no meio 
    ],
    frameAtual: 0,
    atualizaOFrameAtual() {     
      const intervaloDeFrames = 10;
      const passouOIntervalo = frames % intervaloDeFrames === 0;
      // console.log('passouOIntervalo', passouOIntervalo)

      if(passouOIntervalo) {
        const baseDoIncremento = 1;
        const incremento = baseDoIncremento + legendaryBird.frameAtual;
        const baseRepeticao = legendaryBird.movimentos.length;
        legendaryBird.frameAtual = incremento % baseRepeticao
      }
        // console.log('[incremento]', incremento);
        // console.log('[baseRepeticao]',baseRepeticao);
        // console.log('[frame]', incremento % baseRepeticao);
    },

desenhar(){ // Função para mostrar o passarinho na tela

      legendaryBird.atualizaOFrameAtual();
      const { spriteX, spriteY } = legendaryBird.movimentos[legendaryBird.frameAtual];


        contexto.drawImage(
        sprites,
        spriteX, spriteY, // Sprite X, Sprite Y
        legendaryBird.largura, legendaryBird.altura, // Tamanho do recorte da Sprite
        legendaryBird.x, legendaryBird.y,
        legendaryBird.largura, legendaryBird.altura,
);

    }
};
    return legendaryBird;
}

function criaTiros() {
    return {
        lista: [],
        atirar(x, y) {
            this.lista.push({
                x,
                y,
                largura: 307,
                altura: 1024,
                frame: 0,
                totalFrames: 5,
                tempoFrame: 5,
                frameContador: 0
            });
        },
        atualizar() {
            this.lista.forEach(tiro => {
                tiro.x += 4;

                // Atualiza animação
                tiro.frameContador++;
                if (tiro.frameContador >= tiro.tempoFrame) {
                    tiro.frame = (tiro.frame + 1) % tiro.totalFrames;
                    tiro.frameContador = 0;
                }
            });

            // Remove tiros fora da tela
            this.lista = this.lista.filter(tiro => tiro.x < canvas.width);
        },
        desenhar() {
            this.lista.forEach(tiro => {
                const spriteX = tiro.frame * tiro.largura;
                contexto.drawImage(
                    spriteTiro,
                    spriteX, 0,
                    tiro.largura, tiro.altura,
                    tiro.x, tiro.y,
                    64, 64 // tamanho visual reduzido
                );
            });
        }
    };
}

const globais = {};
let telaAtiva = {};
function mudaTela(novaTela){
    telaAtiva = novaTela;

    if(telaAtiva.inicializar){
        telaAtiva.inicializar();
    }
}
const Telas = {     
    INICIO: {
        inicializar(){
        globais.legendaryBird = criaBird();
        globais.chao = criaChao();
        globais.canos = criaCanos();
      
    },
        desenhar(){
            planoFundo.desenhar();
            globais.legendaryBird.desenhar();
            globais.canos.desenhar();
            globais.chao.desenhar();
            telaInicio.desenhar(); 
        },
        click(){
            mudaTela(Telas.JOGO); // Troca para a tela de jogo
        },

        atualizar(){
            globais.chao.atualizar(); 
   
          
        }
        
    }
};

Telas.VITORIA = {
    desenhar() {
        contexto.fillStyle = "black";
        contexto.fillRect(0, 0, canvas.width, canvas.height);
        contexto.fillStyle = "white";
        contexto.font = "30px VT323";
        contexto.textAlign = "center";
        contexto.fillText("VOCÊ DERROTOU O BOSS!", canvas.width / 2, canvas.height / 2);
    },
    atualizar() {},
    click() {
        mudaTela(Telas.INICIO);
    }
};

Telas.JOGO = { 
    inicializar(){
        globais.placar = criaPlacar();   
    },
    desenhar(){
        planoFundo.desenhar();
        globais.canos.desenhar();
        globais.chao.desenhar();
        globais.legendaryBird.desenhar();
        globais.placar.desenhar();
},
    click(){
        globais.legendaryBird.pula();
    },
    atualizar(){
        globais.canos.atualizar();
        globais.chao.atualizar(); 
        globais.legendaryBird.atualizar();
        globais.placar.atualizar();

    if (globais.placar.pontos >= 5) {
    mudaTela(Telas.BOSS);
    return;
}
        
    }     
};

Telas.GAME_OVER = {
    desenhar() {
        planoFundo.desenhar();
        globais.chao.desenhar();
        globais.canos.desenhar();
        globais.legendaryBird.desenhar();

        contexto.fillStyle = "rgba(0, 0, 0, 0.6)";
        contexto.fillRect(0, 0, canvas.width, canvas.height);

        contexto.fillStyle = "white";
        contexto.font = '30px "VT323"';
        contexto.textAlign = "center";
        contexto.fillText("GAME OVER", canvas.width / 2, 120);

        contexto.font = '20px "VT323"';
        contexto.fillText(`Pontuação: ${globais.placar.pontos}`, canvas.width / 2, 180);
        contexto.fillText(`Recorde: ${highScore}`, canvas.width / 2, 210);
        contexto.fillText("Clique para jogar novamente", canvas.width / 2, 270);
    },
    click() {
        mudaTela(Telas.INICIO);
    },
    atualizar() {
        // Nada por enquanto
    }
};

Telas.BOSS = {
    inicializar() {
        globais.boss = criaBoss();
        globais.tiros = criaTiros();
    },
    desenhar() {
        planoFundo.desenhar();
        globais.chao.desenhar();
        globais.legendaryBird.desenhar();
        globais.boss.desenhar();
        globais.tiros.desenhar();
    },
    atualizar() {
        globais.chao.atualizar();
        globais.legendaryBird.atualizar();
        globais.boss.atualizar();
        globais.tiros.atualizar();

        // Detecção de acerto
        globais.tiros.lista.forEach((tiro, i) => {
            const b = globais.boss;
            const acertou = tiro.x + tiro.largura >= b.x &&
                            tiro.x <= b.x + b.largura &&
                            tiro.y >= b.y &&
                            tiro.y <= b.y + b.altura;

            if (acertou) {
                b.vida--;
                globais.tiros.lista.splice(i, 1);
                if (b.vida <= 0) {
                    mudaTela(Telas.VITORIA);
                }
            }
        });
    },
    click() {
        globais.legendaryBird.pula(); // pulo com clique normal
    },
    keydown(e) {
        if (e.code === "Space") {
            const bird = globais.legendaryBird;
            globais.tiros.atirar(bird.x + bird.largura, bird.y + bird.altura / 2);
        }
    },
    mouseDown(e) {
        if (e.button === 2) { // botão direito
            const bird = globais.legendaryBird;
            globais.tiros.atirar(bird.x + bird.largura, bird.y + bird.altura / 2);
        }
    }
};

let frames = 0;
let highScore = parseInt(localStorage.getItem("highScore")) || 0;
function loop() {
    if (!pausado) {
        telaAtiva.atualizar();
    }

    telaAtiva.desenhar();

    if (pausado) {
        desenharMenuPause();
    }

    frames++;
    requestAnimationFrame(loop);
}

window.addEventListener("contextmenu", e => e.preventDefault()); // Impede menu do botão direito

window.addEventListener('keydown', function(evento) {
    if (evento.code === 'F9') {
        mudaTela(Telas.BOSS);
    }

    if (telaAtiva.keydown) {
        telaAtiva.keydown(evento);
    }

    if (evento.code === 'Escape') {
    pausado = !pausado;
}
});

window.addEventListener('mousedown', function(evento) {
    if (telaAtiva.mouseDown) {
        telaAtiva.mouseDown(evento);
    }
});

window.addEventListener('click', function(){ // Verifica se houve click dentro do navegador
    if(telaAtiva.click){
        telaAtiva.click();
    }
})

window.addEventListener('keydown', function(evento) {
    if (evento.code === 'F9') {
        mudaTela(Telas.BOSS); // Vai direto para a boss fight
    }
});

mudaTela(Telas.INICIO); // Começa com a tela de inicio 
loop();