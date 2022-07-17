// ==UserScript==
// @name         Melvor Extension
// @version      0.1
// @description  This is a script to add certain automated features to the incremental game Melvor Idle
// @author       9h3d
// @match        https://melvoridle.com/*
// ==/UserScript==

// Global variables
var SCRIPT_AUTO_REFRESH_RATE = 300; // 300 ms, 0.3 s
var pageTitle = '';
var setLootObserver = false;
var clickLoot = true;
var eatAtPercentage = 0.8;
var currentHealthPercentage = 1;
var currentFood = '';
var miniBar = '';
var currentEnemy = '';
var nextSlayerEnemy = '';
var autoSlayerTaskOn = true;
var currentCheckboxValue = '';

function auto_loot() {
    let lootObserver = new MutationObserver(function() {
        if (clickLoot) {
            document.getElementById('combat-btn-loot-all').click(); // Press loot
            clickLoot = false;
        }
    });
    lootObserver.observe(document.getElementById("combat-loot-text"), {characterData: false, childList: true, attributes: false});
    setLootObserver = true;
}

function auto_eat() {
    currentHealthPercentage = document.getElementById("combat-player-hitpoints-current-1").innerHTML / document.getElementById("combat-player-hitpoints-max-1").innerHTML;
    if (currentHealthPercentage < eatAtPercentage) {
        let eatSpam = setInterval(() => {
            currentHealthPercentage = document.getElementById("combat-player-hitpoints-current-1").innerHTML / document.getElementById("combat-player-hitpoints-max-1").innerHTML;
            if (currentHealthPercentage < eatAtPercentage) {
                document.getElementById('combat-footer-minibar-eat-btn').click(); // Press eat (minibar)
            }
        }, 0.1)
        clearTimeout(eatSpam);
    }
}

function auto_run() {
    currentFood = document.getElementById('combat-food-current-qty-1').innerHTML
    if (currentFood === '0') {
        document.getElementById('combat-footer-minibar-run-btn').click(); // Press run (minibar)
    }
}

function auto_slayer() {
    // Add checkbox if not set
    if (!document.getElementById('autoSlayer')) {
        const label = document.createElement("label");
        const autoSlayerCheckbox = document.createElement("input");
        autoSlayerCheckbox.type = 'checkbox';
        autoSlayerCheckbox.id = "autoSlayer";
        const textContent = document.createTextNode("Auto Slayer Task");
        label.appendChild(autoSlayerCheckbox);
        label.appendChild(textContent);
        let appendTarget = document.getElementById('combat-slayer-task-container');
        appendTarget.appendChild(label);
    }
    // If checkbox checked => auto slayer tasks
    if (document.getElementById('autoSlayer').checked) {
        currentEnemy = document.getElementById('combat-enemy-name').innerHTML;
        nextSlayerEnemy = document.getElementById('combat-slayer-task-name').innerHTML.split(' ').slice(2).join(' ');
        if (currentEnemy != nextSlayerEnemy && currentEnemy != '-') {
            document.getElementById('combat-slayer-task-jump').click(); // Press Jump to enemy
        }
    }
}


(function() {
    'use strict';

    // Necessary since the elements are delayed
    setInterval(() => {
        pageTitle = document.getElementById('header-title'); // Current page
        miniBar = document.getElementById('combat-footer-minibar'); // Minibar active when combat

        // Auto loot
        if (pageTitle) {if (pageTitle.innerHTML === 'Combat' && !setLootObserver) { auto_loot(); }}
        clickLoot = true; // Necessary to prevent observer crash with click()

        // Auto eat
        if (pageTitle) {if (miniBar) { auto_eat(); }}

        // Auto run
        if (pageTitle) {if (miniBar) { auto_run(); }}

        // Auto slayer
        if (pageTitle && autoSlayerTaskOn) { auto_slayer(); }

    }, SCRIPT_AUTO_REFRESH_RATE) // 0.3 s


})();
