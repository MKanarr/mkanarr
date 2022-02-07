const contactForm = document.querySelector('.contact-form');
let formName = document.getElementById('name');
let formEmail = document.getElementById('email');
let formSubject = document.getElementById('subject');
let formMessage = document.getElementById('message');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let formData = {
        name: formName.value,
        email: formEmail.value,
        subject: formSubject.value,
        message: formMessage.value
    };

    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.status === 200) {
            alert('Email sent');
            formName.value = '';
            formEmail.value = '';
            formSubject.value = '';
            formMessage.value = '';
        }
    })
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        alert('Email not sent: ' + error);
    });
});