package com.gameaggregator.service;

import org.springframework.boot.SpringApplication;

public class TestSpringServiceTemplateApplication {

	public static void main(String[] args) {
		SpringApplication.from(SpringServiceTemplateApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
