---
title: "The Haunting of a Business Calculator"
date: 2024-08-29T12:24:05-04:00
draft: true
categories: ["tech", "rant"]
cover:
#   image: "img/me1.JPG"
  alt: "test"
#   caption: "test"
  relative: false
---

## The Haunting of a Business Calculator

### Purpose
 Working for an online retail company has been full of many ups and downs. Since the start of my time here, I have been haunted by one software project more than any other, the product pricing calculator. It is not the most complicated project. It is not a large project. It documentation is mediocre. Its number of users is moderate. Its impact on the company is higher than the sum of its parts. The only special thing about this calculator is its ability to consume developer souls across multiple generations, programming languages, stakeholders and ultimately space and time. The purpose of this article is to warn other about the possible dangers of working on a business calculator.

### The Origin
 I first started working on the calculator when I was a still new to programming (a sophomore in college). The calculator suffered from a case of **the person who built this no longer works here**. It was a standalone desktop application written in C# by a person we will call Bob. While I never meet Bob, I got to know them through their work. Bob was never a part of the IT team, but was able to code and distribute their own tools. At the time, this was great for the company, but later became complicated as people would contact the IT team for support with an application we had never heard of. Bobs work was often self titled, including the subject of this post, ***BobCalc***. This calculator and appeared to be the organic evolution of some excel sheet. It seemed that the logic became ***too hot for Excel*** and was implemented in C# by Bob who was very competent business analyst, but a modest programmer. BobCalc was written as a suite of small tools and was never intended to grow into a collaborative project.

 After Bob left, the calculator suffered from a few *issues*. While the implementation was simple, the calculator was very difficult to maintain. The calculator read from local excel files and was a part of a all-in-one C# application containing all of Bob's work. Futhermore, the application an executable with no real release strategy. This means the application would be build locally on a developers computer and distributed to others via dropbox or some other file sharing application. This lead to users having different versions requiring different excel data file schemas.
 
 It was clear that we could not maintain this application and the IT department must absorb the Bob tool suite. What better task for an fresh programming student! I was assigned the task of fixing BobCalc by any means. After some thought I decided to port the desktop app to be a Python Flask application. This seemed like the correct choice at the time since the project was so small! After a few weeks of coding I ported the calculator to a simple web app with 3 endpoints, bootstrap and a few python files. While this solved many problems, it opened up another can of worms as more features were hastily requested. At this point the calculator was formally renamed to *"The Pricing Calculator formally known as BobCalc"*.

 Within the next few months, the complexity of the calculator grew tremendously as features were implemented as fast as possible to satisfy the business (see [extreme go-horse](https://medium.com/@dekaah/22-axioms-of-the-extreme-go-horse-methodology-xgh-9fa739ab55b4) development methodology). During this time the calculator split into two different calculators and relied on API calls to external services. The project was handed off to my boss at the time who proceeded to do the lords work and write documentation before things got too out of hand. While the documentation was very useful for defining formulas it did not cover the river of upstream data that the calculator grew to depend on. My boss maintained the project for the next year or so until it landed my desk again. By this point in time the calculator had grown in complexity and popularity. Yay! 

### The Haunting

 The price calculator can haunt one in many ways, the most common of which being a bug fix. Wherever you find yourself in your work day, the calculator will find you. The haunting puts *technical debt to shame...* It is not quite important enough to refactor, so we just add another log to the fire. A typical bug fix on the calculator starts when a users says "this calculation is wrong". You start your investigation and find that the formulas are behaving exactly as the documentation and test cases verify. You notify the user providing the concrete values used for their calculation. They are not satisfied. One of the values is *incorrect*. You must put on your life preserver and start paddling up the data swamp. There you will find tables that feed other tables that feed calculations for tables the feed tables. You find the source of the river nile, but by this point you have left the scope users BobCalc understanding. The value that was incorrect is because of an anomaly in FedEx shipping costs because a [ship got stuck in the Suez Canal](https://en.wikipedia.org/wiki/2021_Suez_Canal_obstruction). You have successfully debugged the calculator and the only fix is to add more features. You futile programming efforts did not account for geopolitical events. You tell notify the user and begin working on a feature that splits calculations based on time of year to avoid shipping anomies. 

One source of the calculators power is its perceived simplicity. Surly adding another input should not take time out of your current responsibilities right? Its just a simple calculator with 2 different forms right? 