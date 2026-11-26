---
title: Mobile Testing Demo
summary: Android test automation that runs in parallel on two emulators through Selenium Grid and several Appium servers, with Serenity BDD reports.
date: '2025-01'
tags: [Java, Appium, Selenium Grid, Serenity BDD, Gradle, Android]
repo: https://github.com/VasquezRW/MobileTestingDemo
cover: ../../../assets/projects/mobile-testing-demo/cover.png
coverAlt: Serenity BDD report of the demo with every automated test passing.
status: completed
featured: true
order: 1
---

## What it shows

Running mobile tests one device at a time is slow. This project runs the same Android suite on **two emulators at once**: Selenium Grid routes each session to its own Appium server, and Serenity BDD collects the results into a single report.

## How it works

1. Two Android 15 emulators are started from Android Studio's AVD Manager.
2. `start_servers.bat` starts the Selenium Grid hub and one Appium server (UiAutomator2 driver) per emulator.
3. The Grid UI at `localhost:4444/ui` confirms both nodes are up.
4. `./gradlew clean parallelTests -i` runs the suite in parallel.
5. The Serenity report is generated in `target/site/serenity/index.html`.

Device capabilities (platform version, device name, UDID) live in `serenity.properties`, so pointing the suite at other devices is a configuration change, not a code change.

## Stack

Java 21, Gradle 8, Appium 2 with UiAutomator2, Selenium Grid, Serenity BDD, Android Studio emulators.
