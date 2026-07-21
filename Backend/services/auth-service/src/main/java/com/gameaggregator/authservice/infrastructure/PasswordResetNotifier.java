package com.gameaggregator.authservice.infrastructure;
import org.springframework.kafka.core.KafkaTemplate;import org.springframework.stereotype.Component;
@Component public class PasswordResetNotifier{private final KafkaTemplate<String,String> kafka;public PasswordResetNotifier(KafkaTemplate<String,String> kafka){this.kafka=kafka;}public void send(String email,String token){kafka.send("auth.password-reset.requested",email,"{\"email\":\""+email.replace("\"","")+"\",\"token\":\""+token+"\"}");}}
