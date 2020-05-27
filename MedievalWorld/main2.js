class State {
    constructor(name = '?', createdAt = 0, turnsEvolved = 0){
        this.name = name;
        this.createdAt = createdAt;
        this.turnsEvolved = turnsEvolved;
    }

    age(currentTurn){
        return currentTurn - createdAt;
    }
}

class Entity {
    constructor(states = [], turnsEvolved = 0){
        this.states = states;
        this.turnsEvolved = turnsEvolved;
    }

    pushState(state){
        let key = state.name;

        if(key == 'death'){
            if(this.states.life){
                delete this.states.life;
            }
        }

        this.states[key] = state;
    }

    requireState(state, currentTurn){
        if(!this.states[state]){
            this.pushState(new State(state, currentTurn));
        }
    }

    ageState(key){
        this.states[key].turnsEvolved++;
    }

    evolveStates(currentTurn){
        let states = this.states;

        // // Add turnsEvolved counters
        // Object.entries(states).forEach(([key, value]) => {
        //     value.turnsEvolved++;
        // });
        this.turnsEvolved++;

        // Biologic life workings
        if(states.life) {
            this.ageState('life');

            this.requireState('huger');
            this.ageState('hunger');

            this.requireState('faminto');            
        
            if (states.hunger.turnsEvolved > 5) {
                pessoa1.pushState(new State('death', currentTurn));
            }
            
        }

        // Body decomposition workings
        if(states.death){
            this.ageState('death');

            if(!states.decomposition){
                pessoa1.pushState(new State('decomposition', currentTurn));
            } else {
                this.ageState('decomposition');
            }

            if(states.decomposition.turnsEvolved > 10){
                if(states.human && !states.skeleton) {
                    // pessoa1.pushState(new State('skeleton', currentTurn));
                }
            }
        }

        this.states = states;
    }
}

let turnCounter = 0;
let entities = [];

let pessoa1 = new Entity();
pessoa1.pushState(new State('life'));
pessoa1.pushState(new State('human'));

entities.push(pessoa1);


let evolveAll = () => {
    console.log(entities[0]);
    entities.map((entity, index, arr) => {
        arr[index].evolveStates(turnCounter);
    });
    turnCounter++;
}

setInterval(() => {
    evolveAll();
}, 1000);
evolveAll();