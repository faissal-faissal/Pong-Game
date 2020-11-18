

		

window.onload = function()
{
	
		var canvas1;
		canvas1 = document.getElementById('canvas1');
		var canvasWidth = 900;
		var canvasHeight = 600;		
		var ctxt1;
		ctxt1 = canvas1.getContext('2d');		
		canvas1.width = canvasWidth;
		canvas1.height = canvasHeight;
		ctxt1.fillRect(0, 0, canvasWidth, canvasHeight);	
	var canvas2 = document.getElementById('canvas2');
	var canvasWidth = 900;
	var canvasHeight = 600;
	var blockSize = 20;
	var canvasBlockWidth = canvasWidth / blockSize;
	var canvasBlockHeight = canvasHeight / blockSize;
	var ctx;
	var score = 0;
	var delay = 50;
	var racket;
	var tennisBall;
	var newDirection;
	var fin = false;
	

	init();
	
	function init()
	{
		//document.body.appendChild(canvas);

		canvas2.width = canvasWidth;
		canvas2.height = canvasHeight;		
		ctx = canvas2.getContext('2d');
		//canvas2.style.display = "block";
		//canvas2.style.margin = "100px auto";
		//canvas2.style.background = "white";
		racket = new Raquette([[19,25],[20,25],[21,25], [22,25], [23,25], [24,25], [25,25]]);
		tennisBall = new Ball([5,5], [1,1]);
		racket.draw();
		tennisBall.draw();
		//tennisBall.calculVecteur();
		refresh();
	};
	
	function refresh()
	{
		if(tennisBall.position[1] < 29)
		{
			ctx.clearRect(0,0,canvasWidth,canvasHeight);
			//backGroundCanvas();
			canvas2.mozOpaque = false;
			racket.advance();
			tennisBall.advance();
			drawScore();			
			racket.draw();
			tennisBall.draw();
			setTimeout(refresh, delay);
		}
		else
		{
			gameOver()
		}
	};
	
	function backGroundCanvas()
	{
		var img = new Image();
		img.src = "image_fond.jpg";
		img.addEventListener('load', function(){
						ctx.drawImage(img, 0, 0, /*canvasWidth,canvasHeight*/);
						}, false);
	};
	
	function gameOver()
	{
		ctx.fillStyle = "black";
		ctx.strokeStyle = "orange ";
        ctx.lineWidth = 5;		
		ctx.font = "100px solid sans-serif";	
		ctx.strokeText("Game Over", canvasWidth/2 - 250, 100);		
		ctx.fillText("Game Over", canvasWidth/2 - 250, 100);
		ctx.font = "30px solid sans-serif";	
		ctx.strokeText("Appuyer sur la touche Espace pour rejouer", canvasWidth/2 - 280, 150);
		ctx.fillText("Appuyer sur la touche Espace pour rejouer", canvasWidth/2 - 280, 150);
		fin = true;
	};
	
	function drawScore()
	{
		ctx.fillStyle = "blue";
		ctx.font = "200px solid sans-serif";	
		ctx.fillText(score.toString(), canvasWidth/2 -70, canvasHeight/2 + 50)		
	}
	
	function restart()
	{
		racket = new Raquette([[19,25],[20,25],[21,25], [22,25], [23,25], [24,25], [25,25]]);
		tennisBall = new Ball([5,5], [1,1]);
		score = 0;
		delay = 50;
		refresh();		
	}
	
	function Raquette(body)
	{
		this.body = body;
		
// Le fonctionnement utilisé pour la fonction advance se base sur le fait que la raquête est créée de gauche à droite	
		this.advance = function()
		{
			var taille = this.body.length;
			coord = taille ;
			taille = taille - 1;
			
			if(newDirection === "left")
			{
				var xLeftRacket = this.body[0][0];
				if(xLeftRacket != 0)
				{
					var xCoord = this.body[0][0] - 1;
					var yCoord = this.body[0][1];
					this.body.pop();
					this.body.unshift([xCoord, yCoord]);
				}
			}
			else if(newDirection === "right")
			{
				var xRightRacket = this.body[taille][0];
				if(xRightRacket < Math.round(canvasBlockWidth) - 1)		
				{
					var xCoord = this.body[taille][0] + 1;
					var yCoord = this.body[taille][1];
					this.body.splice(coord, 0, [xCoord, yCoord]);
					this.body.splice(0,1);
				}
			}	
			else
			{		
				newDirection = "none";		
			};
			newDirection = "none";
		}
		
		this.draw = function()
		{
			var racketBody = this.body;
			ctx.fillStyle = "#ff0000";	
			var test = this.body.length;
			for(i = 0; i < racketBody.length; i++)
			{
				var xCoord = racketBody[i][0] * blockSize;
				var yCoord = racketBody[i][1] * blockSize;					
				ctx.fillRect(xCoord, yCoord, blockSize, blockSize);
			}
		}
		
	};
	
	function Ball(position, vecteurDirection)
	{
		this.position = position;
		this.vecteurDirection = vecteurDirection;
		var nextDirection;
		var nextPosition;	
		var testChange;
		var testCalcul = "rien";
		
		//var vecteurDirection;
		/*
		this.calculVecteur = function()
		{
			var xCoordVecteur = this.direction[1][0] - this.direction[0][0];
			var yCoordVecteur = this.direction[1][1] - this.direction[0][1];
			vecteurDirection = [xCoordVecteur, yCoordVecteur];
		}
		*/
		this.changeDirection = function()
		{
			
			var test1 = this.position[0];
			var test2 = this.position[1];
			var test3 = this.vecteurDirection[0];
			var test4 = this.vecteurDirection[1];
			var test5 = test4;
			
			if(this.position[0] < 0.000001 && this.vecteurDirection[0] < 0)
			{
				testChange = "murGauche";
				return true;
			}							
			else if(this.position[1] < 0.000001 && this.vecteurDirection[1] < 0)
			{
				testChange = "murHaut";				
				return true;
			}		
			else if(this.position[0] >= (Math.round(canvasBlockWidth) - 1)
					&& this.vecteurDirection[0] > 0)
			{
				testChange = "murDroit";								
				return true;
			}						
			else if(this.position[1] >= 24
					&& this.vecteurDirection[1] > 0)
			{
				testChange = "racquette";								
				return true;
			}		
			else
			{
				testChange = "rien";
				return false;
			}					
		}
		
		this.newDirection = function()
		{
			var newVecteurX;
			var newVecteurY;
			var normeVecteurChoc;
			var produitNorme;
			var xCoordMurDroit = Math.round(canvasBlockWidth) - 1;
			var vecteurMurGauche = [0, 1];
			var vecteurMurDroit = [0, 1];
			var vecteurMurHaut = [1 , 0];
			var vecteurRaquette = [1 , 0];	
			var angleChoc = 0;
			angleChoc = angleChoc.toFixed(4);
			var angleRotation = 2 * angleChoc;
			angleRotation = angleRotation.toFixed(4);
			var matriceRotationAntiHoraire = 
					[[Math.cos(angleRotation), -Math.sin(angleRotation)],
					  [Math.sin(angleRotation), Math.cos(angleRotation)]];
			var matriceRotationHoraire = 
					[[Math.cos(-angleRotation), -Math.sin(-angleRotation)],
					  [Math.sin(-angleRotation), Math.cos(-angleRotation)]];
			var produitScalaire;
			var normeVecteurDirection = 
							Math.sqrt((this.vecteurDirection[0] * this.vecteurDirection[0]) 
								+ (this.vecteurDirection[1] * this.vecteurDirection[1]));


			if(this.position[0] < 0 
					&& this.vecteurDirection[0] < 0
					&& this.vecteurDirection[1] < 0)
			{
				produitScalaire = vecteurMurGauche[0] * this.vecteurDirection[0]
									- vecteurMurGauche[1] * this.vecteurDirection[1];
				normeVecteurChoc = Math.sqrt((vecteurMurHaut[0] * vecteurMurHaut[0]) 
								+ (vecteurMurHaut[1] * vecteurMurHaut[1]));
				produitNorme = normeVecteurDirection * normeVecteurChoc;
				angleChoc = Math.acos(produitScalaire/produitNorme);
				angleRotation = 2 * angleChoc;
				matriceRotationHoraire = 
					[[Math.cos(angleRotation), -Math.sin(angleRotation)],
					  [Math.sin(angleRotation), Math.cos(angleRotation)]];					
				newVecteurX = this.vecteurDirection[0] * matriceRotationHoraire[0][0] + this.vecteurDirection[1] * matriceRotationHoraire[0][1] ;
				newVecteurY = this.vecteurDirection[0] * matriceRotationHoraire[1][0] + this.vecteurDirection[1] * matriceRotationHoraire[1][1] ;	
				this.vecteurDirection = [newVecteurX, newVecteurY];
				
				testCalcul = "murGaucheBasVersHaut";
			}

			if(this.position[0] < 0
					&& this.vecteurDirection[0] < 0
					&& this.vecteurDirection[1] > 0)
			{
				produitScalaire = vecteurMurGauche[0] * this.vecteurDirection[0]
									+ vecteurMurGauche[1] * this.vecteurDirection[1];
				normeVecteurChoc = Math.sqrt((vecteurMurGauche[0] * vecteurMurGauche[0]) 
								+ (vecteurMurGauche[1] * vecteurMurGauche[1]));
				produitNorme = normeVecteurDirection * normeVecteurChoc;
				angleChoc = Math.acos(produitScalaire/produitNorme);
				angleRotation = 2 * angleChoc;
				matriceRotationHoraire = 
					[[Math.cos(angleRotation), Math.sin(angleRotation)],
					  [-Math.sin(angleRotation), Math.cos(angleRotation)]];								
				newVecteurX = this.vecteurDirection[0] * matriceRotationHoraire[0][0] + this.vecteurDirection[1] * matriceRotationHoraire[0][1] ;
				newVecteurY = this.vecteurDirection[0] * matriceRotationHoraire[1][0] + this.vecteurDirection[1] * matriceRotationHoraire[1][1] ;	
				this.vecteurDirection = [newVecteurX, newVecteurY];
				
				testCalcul = "murGaucheHautVersBas";				
			}
						
			if(this.position[1] < 0 
					&& this.vecteurDirection[1] < 0
					&& this.vecteurDirection[0] > 0)
			{
				produitScalaire = vecteurMurHaut[0] * this.vecteurDirection[0]
									+ vecteurMurHaut[1] * this.vecteurDirection[1];
				normeVecteurChoc = Math.sqrt((vecteurMurGauche[0] * vecteurMurGauche[0]) 
								+ (vecteurMurGauche[1] * vecteurMurGauche[1]));
				produitNorme = normeVecteurDirection * normeVecteurChoc;												
				angleChoc = Math.acos(produitScalaire/produitNorme);
				angleRotation = 2 * angleChoc;
				matriceRotationHoraire = 
					[[Math.cos(angleRotation), -Math.sin(angleRotation)],
					  [Math.sin(angleRotation), Math.cos(angleRotation)]];				
				newVecteurX = this.vecteurDirection[0] * matriceRotationHoraire[0][0] + this.vecteurDirection[1] * matriceRotationHoraire[0][1] ;
				newVecteurY = this.vecteurDirection[0] * matriceRotationHoraire[1][0] + this.vecteurDirection[1] * matriceRotationHoraire[1][1] ;	
				this.vecteurDirection = [newVecteurX, newVecteurY];	
				var test1 = produitScalaire;
				var test2 = normeVecteurChoc;
				var test3 = produitNorme;
				var test4 = angleChoc;
				var test5 = angleRotation;
				var test6 = newVecteurX;
				var test7 = newVecteurY;
				var test8 = vecteurDirection;
				
				testCalcul = "murHautGaucheVersDroite";				
			}

			if(this.position[1] < 0 
					&& this.vecteurDirection[1] < 0
					&& this.vecteurDirection[0] < 0)
			{
				produitScalaire = - vecteurMurHaut[0] * this.vecteurDirection[0]
									+ vecteurMurHaut[1] * this.vecteurDirection[1];
				normeVecteurChoc = Math.sqrt((vecteurMurHaut[0] * vecteurMurHaut[0]) 
								+ (vecteurMurHaut[1] * vecteurMurHaut[1]));
				produitNorme = normeVecteurDirection * normeVecteurChoc;
				angleChoc = Math.acos(produitScalaire/produitNorme);
				angleRotation = 2 * angleChoc;
				matriceRotationAntiHoraire = 
					[[Math.cos(angleRotation), Math.sin(angleRotation)],
					  [-Math.sin(angleRotation), Math.cos(angleRotation)]];				
				newVecteurX = this.vecteurDirection[0] * matriceRotationAntiHoraire[0][0] + this.vecteurDirection[1] * matriceRotationAntiHoraire[0][1] ;
				newVecteurY = this.vecteurDirection[0] * matriceRotationAntiHoraire[1][0] + this.vecteurDirection[1] * matriceRotationAntiHoraire[1][1] ;	
				this.vecteurDirection = [newVecteurX, newVecteurY];
				var test1 = produitScalaire;
				var test2 = normeVecteurChoc;
				var test3 = produitNorme;
				var test4 = angleChoc;
				var test5 = angleRotation;
				var test6 = newVecteurX;
				var test7 = newVecteurY;
				var test8 = this.vecteurDirection;	
				testCalcul = "murHautDroiteVersGauche";				
				
			}
			
			if(this.position[0] >= xCoordMurDroit
					&& this.vecteurDirection[0] > 0
					&& this.vecteurDirection[1] > 0)
			{
				produitScalaire = vecteurMurDroit[0] * this.vecteurDirection[0]
									+ vecteurMurDroit[1] * this.vecteurDirection[1];
				normeVecteurChoc = Math.sqrt((vecteurRaquette[0] * vecteurRaquette[0]) 
								+ (vecteurRaquette[1] * vecteurRaquette[1]));
				produitNorme = normeVecteurDirection * normeVecteurChoc;				
				angleChoc = Math.acos(produitScalaire/produitNorme);
				angleRotation = 2 * angleChoc;
				matriceRotationAntiHoraire = 
					[[Math.cos(angleRotation), -Math.sin(angleRotation)],
					  [Math.sin(angleRotation), Math.cos(angleRotation)]];				
				newVecteurX = this.vecteurDirection[0] * matriceRotationAntiHoraire[0][0] + this.vecteurDirection[1] * matriceRotationAntiHoraire[0][1] ;
				newVecteurY = this.vecteurDirection[0] * matriceRotationAntiHoraire[1][0] + this.vecteurDirection[1] * matriceRotationAntiHoraire[1][1] ;	
				this.vecteurDirection = [newVecteurX, newVecteurY];
				testCalcul = "murDroitHautVersBas";				
				
			}
			
			if(this.position[0] >= xCoordMurDroit
					&& this.vecteurDirection[0] > 0
					&& this.vecteurDirection[1] < 0)
			{
				produitScalaire = vecteurMurDroit[0] * this.vecteurDirection[0]
									- vecteurMurDroit[1] * this.vecteurDirection[1];
				normeVecteurChoc = Math.sqrt((vecteurRaquette[0] * vecteurRaquette[0]) 
								+ (vecteurRaquette[1] * vecteurRaquette[1]));				
				produitNorme = normeVecteurDirection * normeVecteurChoc;				
				angleChoc = Math.acos(produitScalaire/produitNorme);
				angleRotation = 2 * angleChoc;
				matriceRotationAntiHoraire = 
					[[Math.cos(angleRotation), Math.sin(angleRotation)],
					  [-Math.sin(angleRotation), Math.cos(angleRotation)]];
				newVecteurX = this.vecteurDirection[0] * matriceRotationAntiHoraire[0][0] + this.vecteurDirection[1] * matriceRotationAntiHoraire[0][1] ;
				newVecteurY = this.vecteurDirection[0] * matriceRotationAntiHoraire[1][0] + this.vecteurDirection[1] * matriceRotationAntiHoraire[1][1] ;	
				this.vecteurDirection = [newVecteurX, newVecteurY];		
				testCalcul = "murDroitBasVersHaut";				
				
			}			
			
			if(this.position[1] === 24
					&& this.vecteurDirection[1] > 0
					&& this.vecteurDirection[0] > 0)
			{
				
				
				var testRacquette = false;
				for(i = 0; i < racket.body.length; i++)
				{
					var yCoord = racket.body[i][0];
					if(this.position[0] === yCoord)
					{
						testRacquette = true;
						score +=1;
						if(delay >= 15)
						{
							//delay -= 5;
						}
						break;
					}
				}
				
				if(testRacquette)
				{					
					produitScalaire = vecteurRaquette[0] * this.vecteurDirection[0] 
										+ vecteurRaquette[1] * this.vecteurDirection[1];
					normeVecteurChoc = Math.sqrt((vecteurRaquette[0] * vecteurRaquette[0]) 
									+ (vecteurRaquette[1] * vecteurRaquette[1]));
					produitNorme = 	normeVecteurDirection * normeVecteurChoc;
					angleChoc = Math.acos(produitScalaire/produitNorme);
					angleRotation = 2 * angleChoc;
					matriceRotationAntiHoraire = 
						[[Math.cos(angleRotation), Math.sin(angleRotation)],
						[-Math.sin(angleRotation), Math.cos(angleRotation)]];
					newVecteurX = this.vecteurDirection[0] * matriceRotationAntiHoraire[0][0] + this.vecteurDirection[1] * matriceRotationAntiHoraire[0][1] ;
					newVecteurY = this.vecteurDirection[0] * matriceRotationAntiHoraire[1][0] + this.vecteurDirection[1] * matriceRotationAntiHoraire[1][1] ;	
					this.vecteurDirection = [newVecteurX, newVecteurY];
				}
				
				testCalcul = "racquetteGaucheVersDroite";	
				testRacquette = false;
			}		
			
			if(this.position[1] === 24
					&& this.vecteurDirection[1] > 0
					&& this.vecteurDirection[0] < 0)
			{
				
				var testRacquette = false;
				for(i = 0; i < racket.body.length; i++)
				{
					var yCoord = racket.body[i][0];
					if(this.position[0] === yCoord)
					{
						testRacquette = true;
						score += 1;
						if(delay >= 15)
						{
							//delay -= 5;
						}
						break;
					}
				}
				
				if(testRacquette)
				{							
					produitScalaire = - vecteurRaquette[0] * this.vecteurDirection[0]
										+ vecteurRaquette[1] * this.vecteurDirection[1];
					normeVecteurChoc = Math.sqrt((vecteurRaquette[0] * vecteurRaquette[0]) 
									+ (vecteurRaquette[1] * vecteurRaquette[1]));
					produitNorme = 	normeVecteurDirection * normeVecteurChoc;
					angleChoc = Math.acos(produitScalaire/produitNorme);
					angleRotation = 2 * angleChoc;
					matriceRotationHoraire = 
						[[Math.cos(angleRotation), -Math.sin(angleRotation)],
						[Math.sin(angleRotation), Math.cos(angleRotation)]];				
					newVecteurX = this.vecteurDirection[0] * matriceRotationHoraire[0][0] + this.vecteurDirection[1] * matriceRotationHoraire[0][1] ;
					newVecteurY = this.vecteurDirection[0] * matriceRotationHoraire[1][0] + this.vecteurDirection[1] * matriceRotationHoraire[1][1] ;	
					this.vecteurDirection = [newVecteurX, newVecteurY];		
					
				}				
				testRacquette = false;
				testCalcul = "racquetteDroiteVersGauche";	
				
			}

		}

		this.advance = function()
		{
			//this.calculVecteur();
			if(this.changeDirection())
			{
				var test = this.vecteurDirection;
				var test2 = this.position[0];
				var test3 = this.position[1];
				this.newDirection();
			}
			
			var xNextPosition = this.position[0] + this.vecteurDirection[0]/2;
			var yNextPosition = this.position[1] + this.vecteurDirection[1]/2;
			nextPosition = [xNextPosition, yNextPosition];
			this.position = nextPosition;
			var test3 = Math.round(canvasBlockWidth) - 2;
			var test = this.position;
			var test8 =  this.vecteurDirection;
			var test9 = testChange;
			var test10 = testCalcul;
			var test2 = this.position;				
		};
		
		this.draw = function()
		{			
			var radius = blockSize/2;
			var x = (this.position[0] + 0.5) * blockSize;	
			var y = (this.position[1] + 0.5) * blockSize;
			var test = x;
			var test2 = y;
			var test3 = x;			
			ctx.fillStyle = "orange";
			ctx.beginPath();
			ctx.arc(x, y, radius, 0, 2 * Math.PI);
			ctx.fill();
		};
		
	};
	
	document.onkeydown = function handleKeyDown(e)
	{
		var key = e.keyCode;
		switch(key)
		{
			case 37 :
				newDirection = "left";
				break;
			case 39 :
				newDirection = "right";		
				break;
			case 32:
				if(fin)
				{
					fin = false;
					restart();
				}
			default : 
				return;
		}
	}
}