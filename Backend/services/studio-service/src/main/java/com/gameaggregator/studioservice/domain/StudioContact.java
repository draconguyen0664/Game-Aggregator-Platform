package com.gameaggregator.studioservice.domain;
import jakarta.persistence.*; import java.util.UUID;
@Entity @Table(name="studio_contacts") public class StudioContact { @Id public UUID id=UUID.randomUUID(); @Column(nullable=false) public UUID studioId; @Column(nullable=false) public String type; @Column(nullable=false) public String value; public boolean primaryContact; protected StudioContact(){} public StudioContact(UUID s,String t,String v,boolean p){studioId=s;type=t;value=v;primaryContact=p;} }
