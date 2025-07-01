document.addEventListener("DOMContentLoaded", () => {
    const hamburguer = document.getElementById("hamburguer-menu");
    const sidebar = document.querySelector("nav.sidebar-nav");

    if (hamburguer || sidebar) {
        document.addEventListener("click", function(event) {
            if (event.target === hamburguer) {
                sidebar.classList.toggle("showed");
            } else if (!sidebar.contains(event.target)) {
                sidebar.classList.remove("showed");
            }
        });
    }
});
