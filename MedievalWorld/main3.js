class Card {
	constructor({cardType = undefined,
            cardTags = undefined,
			position = undefined,
            seed = undefined,
			memory = undefined,
			status = undefined
		}){
		this.cardType = (cardType) ? cardType : [];
        this.cardTags = (cardTags) ? cardTags : [];
        this.seed = (seed) ? seed : [0, 0];
        this.position = (position) ? position : {x: 0, y: 0};
        
        const blankMemory = {
            buildings: [],
            places: []
        };

        this.memory = Object.assign(blankMemory, memory);
        
        const blankStatus =  {
            bodyContainer: {
                equipments: {
                    upperbody: {},
                    bottombody: {},
                },
                items: []
            }
        };
        this.status = Object.assign(blankStatus, status);
	}
}

let cottage1 = new Card({	cardType: 'building',	cardTags: ['cottage'],	position: { x: 1, y: 1},});

let minakiForest = new Card({	cardType: 'place',	cardTags: ['forest'],	position: { x: 40, y: 1},});

// Peasant equips
let crossbow1 = new Card({	cardType: 'item',	cardTags: ['crossbow'],	seed: [-91354, 74326],});
let marriedRing1 = new Card({	cardType: 'item',	cardTags: ['ring'],});
let leatherArmor1 = new Card({	cardType: 'item',	cardTags: ['leather', 'armor'],});
let leatherPants1 = new Card({	cardType: 'item',	cardTags: ['leather', 'pants'],});
let boots1 = new Card({	cardType: 'item',	cardTags: ['leather', 'boots'],});
let cesta1 = new Card({	cardType: 'item',	cardTags: ['cesta']});
let mochila1 = new Card({	cardType: 'item',	cardTags: ['mochila-A', 'mochila'] });
mochila1.status.bodyContainer.items.push(cesta1);

let peasant1 = new Card({
	cardType: 'unit',
	cardTags: ['peasant'],
	position: { x: 0, y: 0},
	memory: {
        buildings: [
			{tags: ['currentHome'], card: cottage1}
		],
		places: [
			{tags: ['eijipi-herbs'], card: minakiForest}
		],
	},
	status:{
		bodyContainer: {
			equipments: {
				upperbody: {
                    torso: [leatherArmor1], 
                    rightHand: {
                        marryFinger: [marriedRing1]
                    },
                    bothHands: [crossbow1]
                },
				bottombody: {
                    legs: [leatherPants1], 
                    feet: [boots1]
                },
            }
		}
	}
});