import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

plugins {
    kotlin("jvm") version "2.3.10"
    kotlin("plugin.spring") version "2.2.21"
	kotlin("plugin.allopen") version "2.3.10"
	
	id("org.springframework.boot") version "4.0.3"
	id("io.spring.dependency-management") version "1.1.7"

	java
}

group = "com.vayu.radio"
version = "0.0.1-SNAPSHOT"
description = "APIs for Morse Code Scanner"

kotlin {
    jvmToolchain(25)
}

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(25)
	}
}

repositories {
	mavenCentral()
}

tasks.named("compileJava") {
    dependsOn("compileKotlin")
}

sourceSets {
    main {
        java.srcDirs("src/main/java", "src/main/kotlin")
        kotlin.srcDirs("src/main/java", "src/main/kotlin")
    }
    test {
        java.srcDirs("src/test/java", "src/test/kotlin")
        kotlin.srcDirs("src/test/java", "src/test/kotlin")
    }
}

dependencies {
	// Spring
    implementation("org.springframework.boot:spring-boot-starter")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-actuator")

	// Lexer and Parser
	implementation("org.antlr:antlr4-runtime:4.13.2")

	// DevTools (hot reload in development)
    developmentOnly("org.springframework.boot:spring-boot-devtools")

	// Websocket and SSE
	implementation("org.springframework.boot:spring-boot-starter-webflux")
	implementation("org.springframework.boot:spring-boot-starter-websocket")

	// Message Broker using JSON
	implementation("org.projectlombok:lombok")
	annotationProcessor("org.projectlombok:lombok")
	
	implementation("org.springframework.kafka:spring-kafka")
	implementation("com.fasterxml.jackson.module:jackson-module-kotlin")

	// Security
	implementation("org.springframework.security:spring-security-messaging")

	// Kotlin
	implementation(kotlin("stdlib"))
    implementation(kotlin("reflect"))

	// Test
	testImplementation(kotlin("test"))

	testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
	testImplementation("org.springframework.kafka:spring-kafka-test")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
}

tasks.withType<KotlinCompile> {
	compilerOptions {
		freeCompilerArgs.addAll(
			"-Xjsr305=strict",
			"-Xannotation-default-target=param-property"
		)
	}
}

tasks.withType<JavaCompile> {
}

tasks.withType<Test> {
	useJUnitPlatform()
}
