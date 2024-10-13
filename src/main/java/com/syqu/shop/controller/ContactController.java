package com.syqu.shop.controller;

import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

import com.syqu.shop.domain.ContactMessage;
import com.syqu.shop.repository.ContactMessageRepository;

@Controller
public class ContactController {

    private final ContactMessageRepository contactMessageRepository;
    private final JavaMailSender mailSender;

    // Constructor injection
    @Autowired
    public ContactController(ContactMessageRepository contactMessageRepository, JavaMailSender mailSender) {
        this.contactMessageRepository = contactMessageRepository;
        this.mailSender = mailSender;
    }

    // @GetMapping("/contact")
    // public String showContactForm(Model model) {
    //     model.addAttribute("contactMessage", new ContactMessage());
    //     return "contact";
    // }

    @PostMapping("/submitContact")
    public String submitContactForm(@Valid @ModelAttribute("contactMessage") ContactMessage contactMessage, BindingResult result, Model model) {
        if (result.hasErrors()) {
            return "contact";  // Return to the form if there are validation errors
        }

        // Save contact message to the database
        try {
            contactMessageRepository.save(contactMessage);
        } catch (Exception e) {
            model.addAttribute("errorMessage", "Failed to save message to the database.");
            return "contact";  // Return to the form if saving fails
        }

        // Send an email
        try {
            sendEmail(contactMessage);
            model.addAttribute("successMessage", "Your message has been sent successfully!");
        } catch (MailSendException e) {
            model.addAttribute("errorMessage", "Failed to send email. Please try again later.");
            System.err.println("MailSendException: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            model.addAttribute("errorMessage", "An unexpected error occurred. Please try again later.");
            System.err.println("Exception: " + e.getMessage());
            e.printStackTrace();
        }

        return "contact";
    }

    private void sendEmail(ContactMessage contactMessage) throws MailSendException {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo("thutanphan95@gmail.com");  // Support or recipient email
        message.setSubject("New Contact Message from " + contactMessage.getName());
        message.setText("Name: " + contactMessage.getName() + "\n" +
                        "Email: " + contactMessage.getEmail() + "\n\n" +
                        "Message:\n" + contactMessage.getMessage());

        // Send email
        mailSender.send(message);
    }
}
