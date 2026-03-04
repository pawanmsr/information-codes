package com.vayu.radio

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@SpringBootApplication
class RadioApplication {

	@RequestMapping("/")
	fun home() = "Morse code radio!"

}

fun main(args: Array<String>) {
	runApplication<RadioApplication>(*args)
}
