// About Me content is the one by default shown
$('#educationContent').hide();
$('#publicationsContent').hide();
$('#experienceContent').hide();
$('#conferencesContent').hide();
$('#projectsContent').hide();
$('#tutorialsContent').hide();
$('#academicContent').hide();
/* Template
$('#nameContent').hide();
*/

$(document).ready(function(){

	// Force light mode only
	localStorage.theme = "light";
	
	// First time, check the locale
	let userLang = navigator.language || navigator.userLanguage;
	if(localStorage.getItem("lan") === null){
		localStorage.lan = "en";
		if (userLang.split('-')[0] == "bn" || userLang.split('-')[0] == "es")
			localStorage.lan = "es";
	}

	if(localStorage.lan == "es") {
		$('#language-toggle').addClass("bn");
	}
	updateLanguage();
	initializeDefaultSection();

	// Handle 'About Me' content
	$('#aboutme').click(function(e) {

		// If the div has already the class active, no need to reload the divs...
		if(!$(e.target).hasClass('active')) {
			// Update navbar
			clearActiveLinks();
			activateLink(e);

			// Hide other contents
			clearActiveDivs();

			// Show current content
			activateDiv('#aboutmeContent');
		}

	});

	$('#navbarList .nav-link').click(function() {
		if ($(window).width() < 768) {
			const navbar = document.getElementById('collapsingNavbar3');
			if (navbar && navbar.classList.contains('show')) {
				bootstrap.Collapse.getOrCreateInstance(navbar).hide();
			}
		}
	});

	// Handle 'Education' content
	$('#education').click(function(e) {

		// If the div has already the class active, no need to reload the divs...
		if(!$(e.target).hasClass('active')) {
			// Update navbar
			clearActiveLinks();
			activateLink(e);

			// Hide other contents
			clearActiveDivs();

			// Show current content
			activateDiv('#educationContent');
		}
	});

	// Handle 'Publications' content
	$('#publications').click(function(e) {

		// If the div has already the class active, no need to reload the divs...
		if(!$(e.target).hasClass('active')) {
			// Update navbar
			clearActiveLinks();
			activateLink(e);

			// Hide other contents
			clearActiveDivs();

			// Show current content
			activateDiv('#publicationsContent');
		}
	});

	// Handle 'Blog' content
	$('#tutorials').click(function(e) {

		// If the div has already the class active, no need to reload the divs...
		if(!$(e.target).hasClass('active')) {
			// Update navbar
			clearActiveLinks();
			activateLink(e);

			// Hide other contents
			clearActiveDivs();

			// Show current content
			activateDiv('#tutorialsContent');
		}
	});

	// Handle 'Academic' content
	$('#academic').click(function(e) {

		// If the div has already the class active, no need to reload the divs...
		if(!$(e.target).hasClass('active')) {
			// Update navbar
			clearActiveLinks();
			activateLink(e);

			// Hide other contents
			clearActiveDivs();

			// Show current content
			activateDiv('#academicContent');
		}
	});

	// Handle 'Conferences' content
	$('#conferences').click(function(e) {

		// If the div has already the class active, no need to reload the divs...
		if(!$(e.target).hasClass('active')) {
			// Update navbar
			clearActiveLinks();
			activateLink(e);

			// Hide other contents
			clearActiveDivs();

			// Show current content
			activateDiv('#conferencesContent');
		}
	});

	// Handle 'Experience' content
	$('#experience').click(function(e) {

		// If the div has already the class active, no need to reload the divs...
		if(!$(e.target).hasClass('active')) {
			// Update navbar
			clearActiveLinks();
			activateLink(e);

			// Hide other contents
			clearActiveDivs();

			// Show current content
			activateDiv('#experienceContent');
		}
	});

	// Handle 'Projects' content
	$('#projects').click(function(e) {

		// If the div has already the class active, no need to reload the divs...
		if(!$(e.target).hasClass('active')) {
			// Update navbar
			clearActiveLinks();
			activateLink(e);

			// Hide other contents
			clearActiveDivs();

			// Show current content
			activateDiv('#projectsContent');
		}
	});

	/*
	// Handle 'Template' content
	$('#name').click(function(e) {

		// If the div has already the class active, no need to reload the divs...
		if(!$(e.target).hasClass('active')) {
			// Update navbar
			clearActiveLinks();
			activateLink(e);

			// Hide other contents
			clearActiveDivs();

			// Show current content
			activateDiv('#nameContent');
		}
	});
	*/

	// Whenever you clic on a blog post, you should be redirected to that post' html
	$('.clickable').click(function(e) {
		window.open($(e.currentTarget)[0].childNodes[1].innerText, '_blank').focus();
	});

	// Copy the citation to the clipboard
	// THIS SHOULD BE THE SAME FOR ALL THE PAPERS
	$(document).on("click", "#citation", function(){
		var text = $(this).parent().parent().next()[0].innerHTML;

		navigator.clipboard.writeText(text);

		toastr.success('Citation copied');
	});

	// Controls the URL; if it has '#blog'
	// then trigger the 'Blog' clic
	if (((window.location).href).substring(((window.location).href).lastIndexOf('#') + 1) == 'tutorials') {
		$('#tutorials').click();
		$('#tutorialsContent').focus();
	}

	// Language toggle in header
	$('#language-toggle').click(function(e) {
		if(!$(e.currentTarget).hasClass('bn')){
			$(e.currentTarget).addClass('bn');
			localStorage.lan = "es";
		}
		else {
			$(e.currentTarget).removeClass('bn');
			localStorage.lan = "en";
		}

		updateLanguage();
	});

});

function updateLanguage() {
	let lang = localStorage.lan;
	$(".language *").each(function(){
		const translated = $(this).data(lang);
		if (translated !== undefined) {
			$(this).html(translated);
		}
	});

	const toggleText = lang === "es" ? "BN" : "EN";
	$('#language-toggle').text(toggleText);
}

function initializeDefaultSection() {
	const defaultSection = window.defaultSection || "aboutme";
	const sectionMap = {
		aboutme: "#aboutmeContent",
		education: "#educationContent",
		publications: "#publicationsContent",
		academic: "#academicContent",
		tutorials: "#tutorialsContent",
		experience: "#experienceContent",
		conferences: "#conferencesContent",
		projects: "#projectsContent"
	};

	if (!sectionMap[defaultSection]) {
		return;
	}

	clearActiveLinks();
	$(`#${defaultSection}`).addClass("active");
	clearActiveDivs();
	$(sectionMap[defaultSection]).addClass("active").show();
}

function clearActiveLinks() {
	$('#navbarList .nav-item .nav-link').each(function() {
		$(this).removeClass('active');
	});
}

function clearActiveDivs() {
	$('.container .content .active').each(function() {
		$(this).removeClass('active');
		$(this).hide();
	});
}

function activateLink(e) {
	$(e.target).addClass('active');
}

function activateDiv(divId) {
	$(divId).addClass('active');
	$(divId).show();

	// Scrolls to the content
	scrollToContent(divId);
}

function scrollToContent(divId) {
	if ($(window).width() < 751) {
		$('html, body').animate({
			scrollTop: $(divId).offset().top
		}, 1);
	}
}
