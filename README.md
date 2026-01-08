# Curbside Celebrations

A premium website for a mailbox and home decoration service targeting affluent suburban women in Suwanee, GA and surrounding areas.

## Overview

Curbside Celebrations offers professional seasonal decoration services for mailboxes, front landings, and more. The business provides convenient, full-service decoration packages for holidays, special occasions, and seasonal displays.

## Features

### Current Offerings
- **Seasonal Packages**: Holiday Magic, Spring Awakening, Patriotic Pride, Fall Harvest
- **Special Occasions**: Birthday Bash packages
- **Custom Creations**: Personalized decoration options
- **Add-ons**: Front landing decor, yard signs, wreaths, and premium lighting

### Website Features
- Responsive design optimized for desktop, tablet, and mobile devices
- Elegant color palette featuring sage green, gold, cream, and white
- Interactive package showcase with detailed descriptions
- Contact form with package pre-selection
- Smooth scroll navigation
- Mobile-friendly hamburger menu
- Scroll animations for enhanced user experience

## Design Philosophy

### Target Audience
Affluent suburban women in the Suwanee, GA area who value:
- Convenience and full-service solutions
- High-quality, professionally designed decorations
- Seasonal and holiday home beautification
- Premium aesthetics and curb appeal

### Brand Identity
- **Business Name**: Curbside Celebrations
- **Tagline**: Suwanee's Premier Home Decoration Service
- **Colors**:
  - Primary: Sage Green (#7a9b76)
  - Accent: Gold (#c9a55b)
  - Neutrals: Cream (#f8f6f3) and White
- **Typography**:
  - Headings: Cormorant Garamond (elegant serif)
  - Body: Montserrat (clean sans-serif)

### Scalability
The brand is designed to be flexible and expandable beyond mailbox decorations:
- Easily add new service categories
- Accommodate front landing decor
- Support lawn signs and yard displays
- Potential for wreath and door decoration services
- Room for seasonal porch decoration packages

## File Structure

```
/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and responsive design
├── script.js           # Interactive functionality
└── README.md           # Project documentation
```

## Technical Details

### Technologies Used
- HTML5
- CSS3 (with CSS Grid and Flexbox)
- Vanilla JavaScript (ES6+)
- Google Fonts (Cormorant Garamond & Montserrat)

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Responsive breakpoints at 968px, 768px, and 480px
- Mobile-first approach

### Key Functionality
1. **Mobile Navigation**: Hamburger menu with smooth toggle animation
2. **Smooth Scrolling**: Enhanced navigation between sections
3. **Form Handling**: Contact form with validation and success notifications
4. **Package Booking**: Quick booking buttons that auto-fill contact form
5. **Scroll Animations**: Fade-in effects for package cards and features
6. **Dynamic Content**: Intersection Observer for performance-optimized animations

## Getting Started

### Viewing the Website
Simply open `index.html` in any modern web browser.

### Customization

#### Updating Contact Information
Edit the contact section in `index.html` (lines ~450-480):
- Phone number
- Email address
- Service hours
- Social media links

#### Adding New Packages
To add a new seasonal package:
1. Copy an existing `.package-card` div in `index.html`
2. Update the content (title, description, features, price)
3. Add a new background style in `styles.css` under "Package Image Backgrounds"
4. Add the option to the contact form dropdown

#### Changing Colors
Update CSS variables in `styles.css` (lines 7-19):
```css
:root {
    --primary-color: #7a9b76;
    --accent-gold: #c9a55b;
    /* ... etc */
}
```

#### Adding Real Images
Replace the gradient placeholders with real images:
```css
.holiday-package {
    background-image: url('path/to/image.jpg');
}
```

## Future Enhancements

### Recommended Next Steps
1. **Backend Integration**:
   - Connect contact form to email service (EmailJS, Formspree, or custom backend)
   - Set up booking/scheduling system
   - Payment processing integration

2. **Content Management**:
   - Add CMS for easy content updates
   - Image gallery for past work
   - Customer testimonials section

3. **E-commerce Features**:
   - Online booking calendar
   - Package customization tool
   - Secure payment gateway
   - Order confirmation system

4. **Marketing Integration**:
   - Google Analytics tracking
   - Facebook Pixel integration
   - Email newsletter signup
   - Social media feed integration

5. **Additional Pages**:
   - Portfolio/Gallery page
   - About Us page
   - FAQ section
   - Blog for seasonal decoration tips

## Service Area

Currently serving:
- Suwanee, GA
- Johns Creek
- Duluth
- Sugar Hill
- Buford
- Cumming
- Alpharetta

## Contact

**Curbside Celebrations**
Phone: (770) 555-0123
Email: hello@curbsidecelebrations.com

---

*Website designed and developed for premium home decoration services in the Suwanee, GA area.*
