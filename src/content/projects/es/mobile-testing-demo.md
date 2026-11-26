---
title: Mobile Testing Demo
summary: Automatización de pruebas Android que corre en paralelo en dos emuladores con Selenium Grid y varios servidores Appium, con reportes de Serenity BDD.
date: '2025-01'
tags: [Java, Appium, Selenium Grid, Serenity BDD, Gradle, Android]
repo: https://github.com/VasquezRW/MobileTestingDemo
cover: ../../../assets/projects/mobile-testing-demo/cover.png
coverAlt: Reporte de Serenity BDD del demo con todas las pruebas automatizadas aprobadas.
status: completed
featured: true
order: 1
---

## Qué demuestra

Ejecutar pruebas móviles en un dispositivo a la vez es lento. Este proyecto corre la misma suite de Android en **dos emuladores al mismo tiempo**: Selenium Grid envía cada sesión a su propio servidor Appium y Serenity BDD reúne los resultados en un solo reporte.

## Cómo funciona

1. Se inician dos emuladores con Android 15 desde el AVD Manager de Android Studio.
2. `start_servers.bat` levanta el hub de Selenium Grid y un servidor Appium (driver UiAutomator2) por emulador.
3. La interfaz del Grid en `localhost:4444/ui` confirma que ambos nodos están activos.
4. `./gradlew clean parallelTests -i` ejecuta la suite en paralelo.
5. El reporte de Serenity se genera en `target/site/serenity/index.html`.

Las capacidades de cada dispositivo (versión, nombre, UDID) están en `serenity.properties`, así que apuntar la suite a otros dispositivos es un cambio de configuración, no de código.

## Tecnologías

Java 21, Gradle 8, Appium 2 con UiAutomator2, Selenium Grid, Serenity BDD y emuladores de Android Studio.
