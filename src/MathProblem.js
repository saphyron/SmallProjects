// Function to calculate the experience required to reach a given mastery level
function experienceToLevel(masteryLevel) {
    let totalExperience = 0;
    for (let level = 1; level < masteryLevel; level++) {
        totalExperience += 1/4 * (level + 300 * Math.pow(2, level / 7));
    }
    return totalExperience;
}

// Function to calculate mastery bar increase
function getMasteryBarIncrease(masteryLevel) {
    let experienceForCurrentLevel = experienceToLevel(masteryLevel);
    let experienceForNextLevel = experienceToLevel(masteryLevel + 1);
    
    let experiencePerInterval = masteryLevel * 5; // Each mastery level equals 5 experience
    let totalExperienceForNextLevel = experienceForNextLevel - experienceForCurrentLevel;

    return (experiencePerInterval / totalExperienceForNextLevel) * 100;
}

function simulate(iterations, health, regenPer5Sec, damageMin, damageMax, hitIntervalSec,
    healthPercentageForCritical, healthPercentageForHeal, food, foodHealingPerUnit,
    initialMasteryLevel, gearBonus, globalMastery, relic, perceptionCheck) {
    let totalTimeToDie = 0;
    let minTimeToDie = Number.MAX_VALUE;
    let maxTimeToDie = 0;
    let totalWins = 0;
    let totalTimeToWin = 0;
    let highestMasteryLevel = 0; // Variable to track the highest mastery level

    let tenProcentBonus = false;
    let twntyfiveProcentBonus = false;
    let fiftyProcentBonus = false;
    let ninetyfiveProcentBonus = false;
    let maxDuration = 0;

    // Calculating critical health and healed health based on percentages
    const criticalHealthThreshold = health * (healthPercentageForCritical / 100);
    const healedHealth = health * (healthPercentageForHeal / 100);
    
    for (let i = 0; i < iterations; i++) {

        if(iterations > 10000) {
            console.log('Too many iterations');
            console.log('Code is going to take more than 1 hour to compile');
            console.log('');
            console.log('');
            console.log('');
            break;
        }
        if(globalMastery > 10) {
            tenProcentBonus = true
        }
        if(globalMastery > 25) {
            twntyfiveProcentBonus = true
        }
        if(globalMastery > 50) {
            fiftyProcentBonus = true
        }
        if(globalMastery > 95) {
            ninetyfiveProcentBonus = true
        }
        let aquiredRelic = relic;
        let currentHealth = health;
        let foodRemaining = food;
        let masteryLevel = initialMasteryLevel;
        let masteryBar = 0;
        let winChance = 0;
        if(aquiredRelic) {
            winChance = 0.000005; // 0.0025% as a decimal
        } else {
            winChance = 0.000025; // 0.0025% as a decimal
        }
        

        let time = 0;
        let isAlive = true;
        let hasWon = false;
        
        let perception = perceptionCheck;
        let equipmentBonus = gearBonus;
        if(twntyfiveProcentBonus) {
            hitIntervalSec -= 0.2;
        }

        // Calculating food per heal
        const foodPerHeal = Math.ceil((healedHealth - criticalHealthThreshold) / foodHealingPerUnit);

        // Function to calculate random damage
        function getRandomDamage() {
            return Math.floor(Math.random() * (damageMax - damageMin + 1)) + damageMin;
        }

        // Function to calculate success chance
        function getSuccessChance() {
            let bonuses = 0;
            if(tenProcentBonus) {
                bonuses += 30;
            }
            if(ninetyfiveProcentBonus) {
                bonuses += 100;
            }
            if (masteryLevel >= 99) {
                return 1 - Math.min(1, (masteryLevel + 10 + 75 + equipmentBonus + bonuses + 100) / (perception + 100) )
                
            }
            return 1 - Math.min(1, (masteryLevel + 10 + equipmentBonus + bonuses + 100) / (perception + 100) )
        }
        const start = Date.now();
        // Main simulation loop
        while (isAlive && !hasWon) {
            
            time += hitIntervalSec;

            // Apply regular health regeneration
            currentHealth += (regenPer5Sec / (5 / hitIntervalSec));

            // Check for success (replaces getting hit)
            if (Math.random() < getSuccessChance()) {
                currentHealth -= getRandomDamage();
                time += hitIntervalSec;
            } else {
                let masterBonus = 0;
                if(twntyfiveProcentBonus) {
                    masterBonus = 1.03;
                } else {
                    masterBonus = 1.00
                }
                // Increase Mastery Bar
                
                masteryBar += (getMasteryBarIncrease(masteryLevel) * masterBonus);

                if (masteryBar >= 100) {
                    masteryLevel++;
                    masteryBar = 0;
                    if (masteryLevel > highestMasteryLevel) {
                        highestMasteryLevel = masteryLevel; // Update highest mastery level
                    }
                }
            }
            
            if (Math.random() < winChance) {
                hasWon = true;
                totalWins++;
                totalTimeToWin += time;
                break;
            }
            
            

            // Apply conditional healing
            if (currentHealth <= criticalHealthThreshold) {
                if (currentHealth <= 0) {
                    isAlive = false; // Character dies
                } else if (foodRemaining >= foodPerHeal) {
                    currentHealth = healedHealth; // Heal back to upper Threshold
                    foodRemaining -= foodPerHeal; // Consume food
                }
            }
            
        }

        if (!hasWon) {
            totalTimeToDie += time;
            minTimeToDie = Math.min(minTimeToDie, time);
            maxTimeToDie = Math.max(maxTimeToDie, time);
        }
        const end = Date.now(); // End time of the iteration
        const duration = (end - start) / 1000; // Duration in seconds

        if (duration > maxDuration) {
            maxDuration = duration;
        }
        console.log(`Iteration ${i + 1} Execution Time: ${duration.toFixed(2)} seconds`);

        // Check if iteration took longer than 20 seconds
        if (duration > 20) {
            console.log(`Iteration ${i + 1} took too long, stopping simulation`);
            break;
        }
    }

    let avgTimeToDie = totalTimeToDie / (iterations - totalWins);
    let avgTimeToWin = totalWins > 0 ? totalTimeToWin / totalWins : 0;


    let winChance = totalWins / iterations * 100;
    console.log(`Longest Iteration took Execution Time: ${maxDuration.toFixed(2)} seconds`);
    console.log(`Average Time to Die: ${avgTimeToDie.toFixed(2)} seconds`);
    console.log(`Min Time to Die: ${minTimeToDie.toFixed(2)} seconds`);
    console.log(`Max Time to Die: ${maxTimeToDie.toFixed(2)} seconds`);
    console.log(`Total Wins: ${totalWins} out of ${iterations} or a ${winChance.toFixed(2)}% chance of winning.`);
    console.log(`Average Time to Win: ${avgTimeToWin.toFixed(2)} seconds`);
    console.log(`Highest Mastery Level Achieved: ${highestMasteryLevel}`); // Print the highest mastery level

}


// Example usage
simulate(10000, 100, 1, 1, 31, 2.8, 20, 40, 3600, 3, 1, 40, 14, true, 140);
