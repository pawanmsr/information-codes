plugins {
    kotlin("jvm") version "2.3.10"
    kotlin("plugin.spring") version "2.2.21"
	kotlin("plugin.allopen") version "2.3.10"
	
	id("org.springframework.boot") version "4.0.3"
	id("io.spring.dependency-management") version "1.1.7"

	id("java")
}

group = "com.example.receiver"
version = "0.0.1-SNAPSHOT"

name="Receiver"
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
	// Verify dependencies with pom too

	// Spring
    implementation("org.springframework.boot:spring-boot-starter")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-actuator")

	// --- DevTools (hot reload in development) ---
    developmentOnly("org.springframework.boot:spring-boot-devtools")

	// Kotlin
	implementation("org.jetbrains.kotlin:kotlin-stdlib")
	implementation("org.jetbrains.kotlin:kotlin-reflect")

	// Test
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")

    testImplementation(kotlin("test"))
}

tasks.withType<KotlinCompile> {
    compilerOptions {
        compilerOptions {
			freeCompilerArgs.addAll(
				"-Xjsr305=strict",
				"-Xannotation-default-target=param-property"
			)
		}
    }
}

tasks.withType<Test> {
	useJUnitPlatform()
}
