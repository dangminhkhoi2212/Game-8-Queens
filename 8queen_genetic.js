function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const fitnessGoal = 28;
function getFitness(invididual) {
    var conflict = 0;
    var length = invididual.length;
    for (let i = 0; i < length-1; i++) {
        for (let j = i + 1; j < length; j++)
            if (invididual[i] == invididual[j] || Math.abs(invididual[j] - invididual[i]) == Math.abs(j - i))
                conflict += 1;
    }
    return fitnessGoal - conflict
}
function createPopulation(population) {
    while (population.length != 200) {
        var individual = [];
        for (let i = 0; i < 8; i++)
            individual.push(random(1, 8));
        if (population.includes(individual) == false && getFitness(individual) > 25)
            population.push(individual);
    }
}
function deleteIndividual(population, individual) {
    if (individual.length != 0)
        var index = population.indexOf(individual);
    population.splice(index, 1);
}
function getBestIndividual(population) {
    var maxFitness = -1;
    var individual = [];
    population.forEach(temp => {
        if (getFitness(temp) > maxFitness)
            maxFitness = getFitness(temp);
        individual = temp.map((x) => x);
    });
    var x = individual.map((x) => x);
    deleteIndividual(population, x)
    return individual;
}
function crossOver(father, mother, pointCrossOver) {
    var child = []
    for (let i = 0; i < pointCrossOver; i++)
        child.push(father[random(0, 7)]);
    for (let i = pointCrossOver; i < mother.length; i++)
        child.push(mother[random(0, 7)]);
    return child;
}
function getHeuristic(individual) {
    var huristic = [];
    for (let i = 0; i < individual.length; i++) {
        huristic.push(0)
        for (let j = 0; j < individual.length; j++)
            if (i != j && individual[i] == individual[j] || (Math.abs(individual[i] - individual[j]) == Math.abs(i - j)))
                huristic[i] += 1
    }
    return huristic
}
function maxArr(arr) {
    var max = arr[0];
    for (let i = 1; i < arr.length; i++)
        if (max < arr[i])
            max = arr[i];
    return max;
}
function mutation(child) {
    var newchange = -1;
    while (newchange != 0) {
        var newchange = 0;
        var tempChild = child.map((x) => x);
        var huristic = getHeuristic(tempChild);
        var index = huristic.indexOf(maxArr(huristic));
        var maxFitness = getFitness(tempChild);
        for (var i = 1; i <= 8; i++) {
            tempChild[index] = i;
            if (getFitness(tempChild) > maxFitness) {
                maxFitness = getFitness(tempChild);
                newchange = i;
            }
            tempChild = child.map((x) => x);
        }
        if (newchange == 0) {
            for (var i = 0; i < child.length - 1; i++)
                for (var j = i + 1; j < child.length - 1; j++)
                    if (child[i] == child[j]) {
                        var random1 = random(1, 8);
                        while (random1 == child[i]) {
                            random1 = random(1, 8);
                        }
                        child[j] = random1
                    }
        }
        else
            child[index] = newchange;
    }
}
function goal(fitness) {
    return fitness == fitnessGoal;
}
function genetic(numberOfSolutions, solutions) {
    var explore = 0;
    var population = [];
    createPopulation(population)
    while (solutions.length < numberOfSolutions) {
        if (population.length == 0)
            createPopulation(population);
        var father = getBestIndividual(population);
        var mother = getBestIndividual(population);
        if (father.length == 0 || mother.length == 0)
            continue;
        if (goal(getFitness(father)) == true && isExistArray(father, solutions) == false)
            solutions.push(father);
        if (goal(getFitness(mother)) == true && isExistArray(mother, solutions) == false)
            solutions.push(mother);
        var pointCrossOver = random(0, 7);
        var child1 = crossOver(father, mother, pointCrossOver);
        var child2 = crossOver(mother, father, pointCrossOver);
        mutation(child1);
        mutation(child2);
        if (population.includes(child1) == false && isExistArray(child1, father) == false && isExistArray(child1, mother) == false && getFitness(child1) > 20) {
            population.push(child1);
        }
        if (population.includes(child2) == false && isExistArray(child2, father) == false && isExistArray(child2, mother) == false && getFitness(child2) > 25) {
            population.push(child2);
        }
        explore += 1
        // console.log(explore);
        // console.log("child1", child1, child1.length, getFitness(child1))
        // console.log("child2", child2, child2.length, getFitness(child2))
        // console.log("length of population:" + population.length)
        // console.log("length of solutions:" + solutions.length)

    }
}
function equals(arr1, arr2) {
    if (arr1.length != arr2.length)
        return false;
    for (var i = 0; i < arr1.length; i++)
        if (arr1[i] != arr2[i])
            return false;
    return true;
}
function isExistArray(x, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (equals(x, arr[i]) == true)
            return true;
    }
    return false;
}