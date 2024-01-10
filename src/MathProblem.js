function simulate(iterations, health, regenPer5Sec, damageMin, damageMax, hitIntervalSec,
    healthPercentageForCritical, healthPercentageForHeal, food, foodHealingPerUnit,
    initialMasteryLevel, gearBonus, globalMastery) {
    let totalTimeToDie = 0;
    let minTimeToDie = Number.MAX_VALUE;
    let maxTimeToDie = 0;
    let totalWins = 0;
    let totalTimeToWin = 0;

    // Calculating critical health and healed health based on percentages
    const criticalHealthThreshold = health * (healthPercentageForCritical / 100);
    const healedHealth = health * (healthPercentageForHeal / 100);

    for (let i = 0; i < iterations; i++) {
        let tenProcentBonus = false;
        let twntyfiveProcentBonus = false;
        let fiftyProcentBonus = false;
        let ninetyfiveProcentBonus = false;
        switch(globalMastery) {
            case globalMastery > 10:
                tenProcentBonus = true;
                break;
            case globalMastery > 25:
                twntyfiveProcentBonus = true;
                break;
            case globalMastery > 50:
                fiftyProcentBonus = true;
                break;
            case globalMastery > 95:
                ninetyfiveProcentBonus = true;
                break;
            default:
                break;
        }
        let currentHealth = health;
        let foodRemaining = food;
        let masteryLevel = initialMasteryLevel;
        let masteryBar = 0;
        const winChance = 0.000025; // 0.0025% as a decimal

        let time = 0;
        let isAlive = true;
        let hasWon = false;
        
        let perception = 140;
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
                return 1 - (masteryLevel + 10 + 75 + equipmentBonus + bonuses) / perception
            }
            return 1 - (masteryLevel + 10 + equipmentBonus + bonuses) / perception;
        }

        // Function to calculate mastery bar increase
        function getMasteryBarIncrease() {
            return 1 - (masteryLevel / 1.67 / 100);
        }

        // Main simulation loop
        while (isAlive && !hasWon) {
            
            time += hitIntervalSec;

            if (Math.random() < winChance) {
                hasWon = true;
                totalWins++;
                totalTimeToWin += time;
                break;
            }

            // Apply regular health regeneration
            currentHealth += (regenPer5Sec / (5 / hitIntervalSec));

            // Check for success (replaces getting hit)
            if (Math.random() < getSuccessChance()) {
                currentHealth -= getRandomDamage();
                let masterBonus = 0;
                if(twntyfiveProcentBonus) {
                    masterBonus = 1.03;
                }
                // Increase Mastery Bar
                masteryBar += (getMasteryBarIncrease() * masterBonus);
                if (masteryBar >= 100) {
                    masteryLevel++;
                    masteryBar = 0;
                }
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
    }

    let avgTimeToDie = totalTimeToDie / (iterations - totalWins);
    let avgTimeToWin = totalWins > 0 ? totalTimeToWin / totalWins : 0;



    let winChance = totalWins / iterations * 100;

    console.log(`Average Time to Die: ${avgTimeToDie.toFixed(2)} seconds`);
    console.log(`Min Time to Die: ${minTimeToDie.toFixed(2)} seconds`);
    console.log(`Max Time to Die: ${maxTimeToDie.toFixed(2)} seconds`);
    console.log(`Total Wins: ${totalWins} out of ${iterations} or a ${winChance.toFixed(2)}% chance of winning.`);
    console.log(`Average Time to Win: ${avgTimeToWin.toFixed(2)} seconds`);
}

// Example usage
simulate(10000, 100, 1, 1, 31, 2.8, 20, 40, 3600, 3, 1, 40, 8);
