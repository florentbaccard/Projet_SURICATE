// VARIABLES CONTENANT VALEURS UTILES //

const MAX_QTY = 9;
const MIN_QTY = 0;
const productIdKey = "product";
const orderIdKey = "order";
const inputIdKey = "qte";

// TABLEAU QUI STOCK LE CONTENU DU PANIER //

let panier = [];

// FUNCTION D'APPEL ///////////////////////

let init = function () {
	createShop();
	search();
	nav();
	boutonStorage();
	callSave();
	createStorage();
}

// ECOUTEUR D'EVENEMENT LOAD SUR L'OBJET WINDOW, APPEL INIT AU CHARGEMENT DE LA PAGE //

window.addEventListener("load", () => {
	init();
	console.log('hellow');
})

// FUNCTION CREATESHOP /////////////////////////////////////////////////////////////////

let createShop = function () {
	// Je récupère l'objet du DOM avec l'ID "boutique" 
	let shop = document.getElementById("boutique");
	// Boucle parcourant "catalog" en attribuant la fonction "createProduct" à "shop" comme enfant 
	for (i = 0; i < catalog.length; i++) {
		shop.appendChild(createProduct(catalog[i], i));
	}
}

// CREATE PRODUCT ///////////////////////////////////////////////////////////////////////////////////////////////////////

let createProduct = function (product, index) {
	// création d'un élément div : 
	let block = document.createElement("div");
	// J'attribue à "block" la classe "produit" : 
	block.className = "produit";
	// J'attribue un ID qui sera l'index de la boucle et la valeur de "productIDKey" :
	block.id = index + "-" + productIdKey;
	// J'attribue également un "dataset.item" afin d'accéder facilement à la donnée :
	block.dataset.item = product.name.toLowerCase();
	// Dans la variable, je stocke la fonction qui crée la balise H4 et son contenu :
	let blocktitre = createBlock("h4", product.name);
	// À "block", je lui attribue "blockTitre" comme enfant :
	block.appendChild(blocktitre);

	// Je lui attribue "createFigureBlock" comme enfant avec "product" comme argument :
	block.appendChild(createFigureBlock(product));

	// Je réalise le même processus afin de créer les balises dont j'ai besoin :
	block.appendChild(createBlock("div", product.description, "description"));

	block.appendChild(createBlock("div", product.price, "prix"));
	// Dans cette variable, je stocke la fonction qui crée le bloc de contrôle de commande (createOrderControlBlock) :
	let blockControl = createOrderControlBlock(index);
	// J'attribue comme enfant à "block" la variable "blockControl" :
	block.appendChild(blockControl);
	// Je retourne "block" afin d'obtenir son résultat et je sors de la fonction :
	return block;
}

// CREATEBLOCK /////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Dans une variable, je stocke la fonction ayant comme paramètres des valeurs qui sont définies plus haut,
// permettant ainsi d'utiliser la fonction avec différentes valeurs. Dans notre cas, nous pouvons créer différentes balises,
// contenus et classes en les définissant en tant qu'arguments : 

let createBlock = function (balise, content, cssClass) {
	let element = document.createElement(balise);

	// Cette condition est pertinente ; elle permet de définir "cssClass" en tant que classe :
	if (cssClass != undefined) {
		element.className = cssClass;
	}

	element.innerHTML = content;

	return element;
}

// CREATE ORDER CONTROL BLOCK ///////////////////////////////////////////////////////////////////////

let createOrderControlBlock = function (index) {
	let control = document.createElement("div");
	control.className = "controle";
	// Création de l'input :
	let input = document.createElement("input");
	console.log(input)
	input.id = index + '-' + inputIdKey;
	input.type = "number";
	input.value = "0";
	// Valeur min et max :
	input.min = MIN_QTY;
	input.max = MAX_QTY;
	// J'attribue "input" comme enfant de "control" :
	control.appendChild(input);

	// Création du bouton :
	let button = document.createElement("button");
	button.className = 'commander';
	button.id = index + "-" + orderIdKey;
	button.style.cursor = "not-allowed";

	// Écouteur d'événement "click" sur le bouton :
	button.addEventListener('click', () => {
		// Au clic, j'appelle la fonction "addPanier" :
		addPanier(catalog[index], index);
		// Si la valeur de l'input est égale à 0 ou est nulle :
		if (input.value == 0 || null) {
			input.style.border = "1px solid red";
		}
		// Si la valeur de l'input est supérieure à 9, alors la valeur est égale à 9 :
		if (input.value > 9) {
			input.value = 9;
		}
	})

	// Même chose, mais cette fois-ci avec l'écouteur d'événement "keydown" pour la touche Enter :
	// "event" représente l'objet de l'événement.
	input.addEventListener('keydown', (event) => {

		if (event.key === 'Enter') {
			addPanier(catalog[index], index);

			if (input.value == 0 || null) {
				input.style.border = "1px solid red";
			}
			if (input.value > 9) {
				input.value = 9;
			}
		}
	})

	// Je mets un écouteur d'événement "input" sur l'input afin de conditionner les valeurs saisies :

	let valid = input.addEventListener('input', () => {
		console.log('coucoo' + input.value);

		// Je convertis les nombres à virgules en nombres entiers à l'aide de parseInt :
		input.value = parseInt(input.value);

		// Si la valeur de l'input est supérieure à 9, alors la valeur de l'input est égale à 9 :
		if (input.value > 9) {
			input.value = 0;
		}

		// Pour une question de portée et le bon fonctionnement de la fonction, il était nécessaire de stocker
		// la conversion dans une variable et de la rappeler à cet endroit précis :
		let valid = parseInt(input.value);

		// Si "valid" n'est pas un nombre, alors la valeur de l'input est égale à 9 :
		if (isNaN(valid)) {
			input.value = 0;
		}

		// Si la valeur de l'input est supérieure à 0 et inférieure à 10 :
		if (input.value > 0 && input.value < 10) {
			button.style.opacity = "0.75";
			button.style.cursor = "pointer";
		} else {
			button.style.opacity = "0.25";
			button.style.cursor = "not-allowed";
		}

	})

	// Pour finir, j'attribue le bouton comme enfant de "control" :
	control.appendChild(button);

	// Je retourne "control" (donc tous ses enfants) :
	return control;

}

// CREATE FIGURE BLOCK //////////////////////////////////////////////////////////

let createFigureBlock = function (product) {
	// Je crée la figure et l'img et je leur attribue une source et une description alternative :
	let figure = document.createElement("figure");
	let image = document.createElement("img");
	image.src = product.image;
	image.alt = product.name;
	// J'attribue l'image comme enfant de la figure :
	figure.appendChild(image);
	// Je retourne figure (et tous ses enfants) :
	return figure;
}

// ADD PANIER ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addPanier(product, index) {
	// Je récupère les objets nécessaires du DOM :
	let achat = document.getElementsByClassName('achats')[0];
	let qteInput = document.getElementById(index + "-qte");
	let result = Number(qteInput.value);
	let input = document.getElementById(index + "-" + inputIdKey);
	let panie = document.getElementById(index + "-" + orderIdKey);
	console.log(panie + "panie nt");
	// Si "result" est supérieur à 0 et inférieur à 10, j'exécute :
	if (result > 0 && result < 10) {
		// Je récupère l'objet :
		let check = document.getElementById(index + "-bloc");
		// Si il est égal à null, j'exécute :
		if (check == null) {
			// Je crée les différents éléments dans mon panier :
			let bloc = document.createElement('div');
			bloc.setAttribute("id", index + "-bloc");
			let Dt = bloc.dataset.item = index + "-bloc";
			console.log(Dt + 'dt');

			bloc.setAttribute("class", "bloc");

			let imgCart = document.createElement("img");
			imgCart.setAttribute("src", product.image);
			imgCart.className = "imagee";

			bloc.appendChild(imgCart);

			bloc.appendChild(createBlock("h4", product.name, "name"));

			bloc.appendChild(createBlock("div", result, "res"));

			bloc.appendChild(createBlock("div", product.price, "prix"));

			achat.appendChild(bloc);

			let poubelle = document.createElement('button');
			poubelle.className = 'retirer';
			bloc.appendChild(poubelle);
			// À l'événement "click" de mon objet "poubelle", j'exécute ma fonction de rappel (callback) :
			poubelle.addEventListener('click', () => {
				// Je retire mon bloc (article) :
				bloc.remove();
				// J'appelle ma fonction "totalPanier" pour mettre à jour le total :
				totalPanier();

				// Je cherche l'index de l'objet dans mon tableau "panier" et je le stocke dans ma constante "indexToRemove" :
				// "findIndex" est une méthode de tableau qui renvoie l'index du premier élément satisfaisant une condition donnée.
				// Si aucun élément n'est trouvé, elle renvoie -1.
				// Dans l'argument de la méthode, "item" fait référence à l'élément actuel sur lequel la fonction opère.
				// Comme il n'y a qu'un paramètre, les parenthèses sont facultatives, de même que les accolades dans le cas où il y a qu'une expression.

				const indexToRemove = panier.findIndex(item => item.id === Dt);
				// Si l'élément est trouvé (donc différent de -1), je supprime l'élément.
				// Le "1" dans l'argument de la méthode "splice" représente le nombre d'éléments à supprimer :
				if (indexToRemove !== -1) {
					panier.splice(indexToRemove, 1);
				}
				// Si la valeur de l'input est différente de 0, alors la valeur de l'input est égale à 0 :
				if (input.value !== 0) {
					input.value = 0;
					input.style.borderColor = "transparent";
					panie.style.opacity = "0.25";
				}
			})
			// Je définis le style de ma bordure dans le cas où j'ajoute un article non présent :
			input.style.border = "1px solid green";
			// J'appelle la fonction "totalPanier" :
			totalPanier();
			// À chaque ajout, je crée un objet avec différentes propriétés pointant vers des valeurs :
			let object = {
				id: index + "-bloc",
				nom: product.name,
				image: product.image,
				qte: Number(document.getElementById(index + "-bloc").childNodes[2].innerHTML),
				prix: product.price
			}
			// Je le pousse dans mon panier, qui a une portée globale :
			panier.push(object);

			// Sinon (dans le cas où mon article est déjà présent dans mon panier) :
		} else {
			console.log("Coucou");
			console.log(check);
			// Dans ma variable "old", je stocke la valeur de la quantité déjà affichée :
			let old = Number(check.childNodes[2].innerHTML);
			// Dans la variable "newR", j'ajoute "old" à "result" (qui représente la valeur de l'input) :
			let newr = old + result;
			// Si "newR" est supérieur à 9, alors "newR" est égal à 9 (cela permet de ne pas dépasser 9) :
			if (newr > 9) {
				newr = 9;
			}

			// Je définis le style de ma bordure en fonction de la valeur de "newR".
			if (newr > 0 && newr < 9) {
				console.log('green')
				console.log(newr)
				input.style.border = "1px solid green";

			} else if (newr == 9) {
				input.style.border = "1px solid red";
				input.value = 0;
				panie.style.opacity = "0.25";
				panie.style.cursor = "not-allowed";
			}
			// Je récupère le deuxième enfant de "check" et je mets à jour son contenu avec "newR".
			check.childNodes[2].innerHTML = newr;
			// Dans la variable "blocEt", je récupère l'objet du DOM :
			blocet = document.getElementById(index + "-bloc");
			// Dans la variable "dt", je lui attribue un "dataset.item" afin d'accéder à la donnée spécifiée :
			let Dt = blocet.dataset.item = index + "-bloc";
			// Je cherche dans "panier" l'élément qui a comme propriété la valeur de "dt".
			// Une fois trouvé, je modifie "qte" (propriété de l'objet) par "newR" :
			panier.find(item => item.id === Dt).qte = newr;
		}
	}
	// Je rappelle "totalPanier" pour mettre à jour le total :
	totalPanier();
}

// BOUTON STORAGE ///////////////////////////////////////////////////////////////////////////////////////////

// La fonction "boutonStorage" a pour but de créer le bouton qui sauvegarde les données dans le localStorage :

function boutonStorage() {
	// Je récupère les objets du DOM nécessaires :
	let achat = document.getElementsByClassName('achats')[0];
	let butStorage = document.createElement('button');
	let iconeStorage = document.createElement('button');
	iconeStorage.id = "iconeStorage";
	iconeStorage.style.cursor = "pointer";
	butStorage.id = "butStorage";
	butStorage.style.cursor = "pointer";
	butStorage.innerHTML = "Sauvegarde Panier";
	// Je les insère dans le DOM en leur attribuant un parent :
	butStorage.appendChild(iconeStorage);
	achat.appendChild(butStorage);
}

// CALL SAVE ///////////////////////////////////////////////////////

// Fonction de sauvegarde au clic sur le bouton "butStorage" :
function callSave() {

	let butStorage = document.getElementById('butStorage');
	// À l'événement "clic", je stocke mon panier dans le localStorage.
	butStorage.addEventListener('click', () => {
		localStorage.setItem('panier', JSON.stringify(panier));
	})

}

// CREATE STORAGE ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Créer les éléments stockés dans le tableau "panier" au rechargement de la page :

// Appeler au rechargement :

function createStorage() {
	// Je récupère le panier stocké à l'aide de la clé et je le convertis en objet. Si aucune valeur n'est présente, le tableau est vide :
	let get = JSON.parse(localStorage.getItem('panier') || []);
	// Je mets à jour le tableau "panier" avec les données récupérées :
	panier = get;
	console.log(get);
	// Dans une boucle, je parcours "get" tant que "i" est inférieur à sa longueur :
	for (let i = 0; i < get.length; i++) {
		console.log(get[i].image);
		// Je récupère les objets du DOM nécessaires et je crée des éléments :
		let achat = document.getElementsByClassName('achats')[0];

		let bloc = document.createElement("div");
		let Dt = bloc.dataset.item = get[i].id;
		bloc.id = get[i].id;
		bloc.className = "bloc";

		let imgCart = document.createElement("img");
		imgCart.setAttribute("src", get[i].image);
		imgCart.className = "imagee";
		bloc.appendChild(imgCart);

		bloc.appendChild(createBlock("h4", get[i].nom, "name"));
		bloc.appendChild(createBlock("div", get[i].qte, "res"));
		bloc.appendChild(createBlock("div", get[i].prix, "prix"));

		achat.appendChild(bloc);

		let poubelle = document.createElement('button');
		poubelle.className = 'retirer';
		bloc.appendChild(poubelle);
		// Je mets un écouteur d'événement "click" sur l'objet "poubelle" :
		poubelle.addEventListener('click', () => {
			// Au clic, j'exécute :
			bloc.remove();
			// Je rappelle la fonction "totalPanier" pour mettre à jour le total.
			totalPanier();

			// Trouver l'index de l'objet dans le panier.
			const indexToRemove = panier.findIndex(item => item.id === Dt);
			// Si l'objet est trouvé, le supprimer du tableau :
			if (indexToRemove !== -1) {
				panier.splice(indexToRemove, 1);
			}
			// Je mets à jour le localStorage.
			localStorage.setItem('panier', JSON.stringify(panier));
		})
	}
	totalPanier();
}

// TOTAL PANIER ///////////////////////////////////////////////////////////////////////////////

let totalPanier = () => {
	// Je récupère les objets du DOM nécessaires :
	let resulTotal = document.getElementById('total');
	let blo = document.getElementsByClassName('bloc');
	// J'initialise "total" à 0 :
	let total = 0;
	// Dans une boucle, je parcours le tableau contenant les éléments ayant la classe "bloc" :
	for (i = 0; i < blo.length; i++) {
		// Dans des variables, je récupère les enfants de "bloc" représentant la quantité et le prix :
		let quantity = Number(blo[i].childNodes[2].innerHTML);
		let unitPrice = Number(blo[i].childNodes[3].innerHTML);
		// Dans une variable, je multiplie le prix par la quantité :
		let sstot = unitPrice * quantity;

		console.log(unitPrice + "x" + quantity + "=" + sstot);
		// J'affecte à "total" le résultat de "sstot" sans écraser la valeur existante :
		total += sstot;
	}

	console.log("total : " + total);
	// Je mets à jour le contenu de "resulTotal" avec le total.
	resulTotal.innerHTML = "Total : " + total + "€";
	// Je mets à jour le localStorage stockant le total.
	localStorage.setItem('totalPanier', total);
}

/////////////////////////////////////////SEARCH////////////////////////////////////////////////////////

function search() {
	// Je récupère les objets du DOM nécessaires :
	const boxes = document.querySelectorAll('.produit');
	const searchBox = document.getElementById('filter');

	// Si "searchBox" est différent de null, j'exécute :
	if (searchBox !== null) {
		// Je mets à "searchBox" un écouteur d'événement "keyup" et le représente avec l'argument "e" :
		searchBox.addEventListener('keyup', (e) => {
			// Dans cette variable, je stocke la cible de l'événement sur l'objet du DOM, 
			// sa valeur actuelle en ignorant la casse et les espaces avant et après :
			searchText = e.target.value.toLowerCase().trim();
			// Je parcours "boxes" et pour chaque élément, j'exécute la fonction fléchée. 
			// Chaque élément que forEach itère est représenté par "produit",
			// car la fonction fléchée est appelée à chaque itération.
			boxes.forEach((produit) => {
				// Je récupère la data attribuée à "produit" et je la stocke dans ma constante.
				const data = produit.dataset.item;
				// Je vérifie si le contenu de la variable "searchText" est inclus dans "data".
				// En fonction de la véracité de la condition, j'exécute :
				if (data.includes(searchText)) {
					produit.style.display = 'inline-block';
				} else if (Number(searchText)) {
					produit.style.display = 'inline-block';
				} else {
					produit.style.display = 'none';
				}

			})

		})

	}
}

// FUNCTION NAV //////////////////////////////////////////////////////////////

function nav() {
	// Fonction de création de titre et panier pour la version responsive :
	const hOne = document.querySelector('h1');
	const body = document.querySelector('body');
	let shop = document.getElementById('boutique');
	let pannie = document.getElementById('panier');
	let croix = document.createElement('button');
	croix.id = "return";
	croix.style.display = "none";
	croix.style.visibility = "hidden";
	hOne.innerHTML = "ZenTeaVibes";

	let glob = document.createElement('div');
	glob.id = "glob";
	// Création du bouton pour le panier (version responsive) :
	let icone = document.createElement('button');
	icone.id = "icone";
	console.log('nkdjb')

	body.appendChild(glob);
	glob.appendChild(hOne);
	glob.appendChild(icone);
	body.insertBefore(glob, shop);
	glob.appendChild(croix);
	glob.insertBefore(croix, hOne);
	// À l'événement "clic" du panier :

	icone.addEventListener('click', () => {
			croix.style.display = "inline-block";
			croix.style.visibility = "visible";
			shop.style.display = "none";
			shop.style.visibility = "hidden";
			pannie.style.display = "inline-block";
			pannie.style.visibility = "visible";

			croix.addEventListener('click', ()=> {
				shop.style.display = "inline-flex";
				shop.style.visibility = "visible";
				shop.style.flexWrap = "wrap";
				//pannie.style.display = "none";
				//pannie.style.visibility = "hidden";
				croix.style.display = "none";
				croix.style.visibility = "hidden";
			})
	})
}

///////////////////////////////////////////////////////////////////////////////////////////
