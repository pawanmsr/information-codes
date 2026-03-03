plugins {
	id 'java'
	id 'org.springframework.boot' version '4.0.3'

	// Other plugins
    kotlin("jvm") version "2.3.10"
}

apply plugin: 'io.spring.dependency-management'

group = 'com.example'
version = '0.0.1-SNAPSHOT'

java {
	sourceCompatibility = '25'
}

kotlin {
    jvmToolchain(25)
}

repositories {
	mavenCentral()
}

dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-web'
	testImplementation(kotlin("test"))
}
