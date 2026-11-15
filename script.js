// FOR MOBILE NAVIGATION.

const navToggle =
    document.getElementById("navToggle");

const navLinks =
    document.getElementById("navLinks");


navToggle.addEventListener(
    "click",
    () => {

        navLinks.classList.toggle("show");

    }
);


// POST COUNT.

const postCount =
    document.querySelectorAll(
        '.post-card'
    ).length;


document.getElementById(
    'post-count'
).textContent =
    postCount + '+';


// FOR SEARCHING.

document.addEventListener(
    "DOMContentLoaded",
    function () {


        /* =========================================
           GET ELEMENTS
        ========================================= */

        const searchInput =
            document.getElementById("searchInput");


        const noResults =
            document.getElementById("noResults");


        const searchResultsGrid =
            document.getElementById("searchResultsGrid");


        const latestSection =
            document.querySelector(".latest-section");


        const latestPostsGrid =
            document.querySelector(
                ".latest-section .posts-grid"
            );


        const featuredSection =
            document.querySelector(
                ".featured-section"
            );


        /* =========================================
           CHECK REQUIRED ELEMENTS
        ========================================= */

        if (
            !searchInput ||
            !noResults ||
            !searchResultsGrid ||
            !latestPostsGrid
        ) {

            console.error(
                "Required search elements were not found."
            );

            return;

        }


        /* =========================================
           GET ALL ARTICLE CARDS
        ========================================= */

        const posts =
            Array.from(
                latestPostsGrid.querySelectorAll(
                    ".post-card"
                )
            );


        /* =========================================
           SAVE ORIGINAL CARD ORDER
        ========================================= */

        posts.forEach(
            (post, index) => {

                post.dataset.originalIndex =
                    index;

            }
        );


        /* =========================================
           SAVE ORIGINAL TEXT
        ========================================= */

        posts.forEach(
            post => {


                const category =
                    post.querySelector(
                        ".post-category"
                    );


                const title =
                    post.querySelector("h3");


                const desc =
                    post.querySelector("p");


                if (category) {

                    category.dataset.original =
                        category.textContent.trim();

                }


                if (title) {

                    title.dataset.original =
                        title.textContent.trim();

                }


                if (desc) {

                    desc.dataset.original =
                        desc.textContent.trim();

                }

            }
        );


        /* =========================================
           NORMALIZE SEARCH TEXT
        ========================================= */

        function normalizeText(text) {

            return text

                .toLowerCase()

                /*
                 * Chapter shortcuts
                 */

                .replace(
                    /\bchap\b/g,
                    "chapter"
                )

                .replace(
                    /\bch\b/g,
                    "chapter"
                )

                /*
                 * Lecture shortcuts
                 */

                .replace(
                    /\blec\b/g,
                    "lecture"
                )

                .replace(
                    /\blect\b/g,
                    "lecture"
                )

                /*
                 * Remove punctuation
                 */

                .replace(
                    /[^a-z0-9 ]/g,
                    " "
                )

                /*
                 * Remove extra spaces
                 */

                .replace(
                    /\s+/g,
                    " "
                )

                .trim();

        }


        /* =========================================
           FUZZY MATCH
        ========================================= */

        function fuzzyMatch(
            text,
            word
        ) {


            if (!word) {

                return true;

            }


            /*
             * Exact match
             */

            if (
                text.includes(word)
            ) {

                return true;

            }


            /*
             * Allow a small typo
             *
             * Only for words longer
             * than 2 characters.
             */

            if (
                word.length > 2
            ) {


                const shortenedWord =
                    word.slice(
                        0,
                        word.length - 1
                    );


                if (
                    shortenedWord.length > 0 &&
                    text.includes(
                        shortenedWord
                    )
                ) {

                    return true;

                }

            }


            return false;

        }


        /* =========================================
           ESCAPE REGEX
        ========================================= */

        function escapeRegex(text) {

            return text.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

        }


        /* =========================================
           HIGHLIGHT SEARCH WORDS
        ========================================= */

        function highlightText(
            text,
            searchWords
        ) {


            let highlightedText =
                text;


            searchWords.forEach(
                word => {


                    if (
                        !word ||
                        word.length === 0
                    ) {

                        return;

                    }


                    const regex =
                        new RegExp(
                            "(" +
                            escapeRegex(word) +
                            ")",
                            "gi"
                        );


                    highlightedText =
                        highlightedText.replace(
                            regex,
                            "<mark>$1</mark>"
                        );

                }
            );


            return highlightedText;

        }


        /* =========================================
           RESTORE ORIGINAL TEXT
        ========================================= */

        function restoreOriginalText(
            post
        ) {


            const category =
                post.querySelector(
                    ".post-category"
                );


            const title =
                post.querySelector("h3");


            const desc =
                post.querySelector("p");


            if (
                category &&
                category.dataset.original
            ) {

                category.textContent =
                    category.dataset.original;

            }


            if (
                title &&
                title.dataset.original
            ) {

                title.textContent =
                    title.dataset.original;

            }


            if (
                desc &&
                desc.dataset.original
            ) {

                desc.textContent =
                    desc.dataset.original;

            }

        }


        /* =========================================
           RESTORE ORIGINAL PAGE
        ========================================= */

        function restoreOriginalLayout() {


            /*
             * Restore original text
             */

            posts.forEach(
                post => {

                    restoreOriginalText(
                        post
                    );

                    post.style.display =
                        "";

                }
            );


            /*
             * Restore original card order
             */

            const fragment =
                document.createDocumentFragment();


            posts
                .sort(
                    (a, b) =>
                        Number(
                            a.dataset.originalIndex
                        ) -
                        Number(
                            b.dataset.originalIndex
                        )
                )
                .forEach(
                    post => {

                        fragment.appendChild(
                            post
                        );

                    }
                );


            latestPostsGrid.appendChild(
                fragment
            );


            /*
             * Clear search results area
             */

            searchResultsGrid.innerHTML =
                "";

            searchResultsGrid.style.display =
                "none";


            /*
             * Restore normal sections
             */

            if (latestSection) {

                latestSection.style.display =
                    "";

            }


            if (featuredSection) {

                featuredSection.style.display =
                    "";

            }


            /*
             * Hide result message
             */

            noResults.style.display =
                "none";

            noResults.innerHTML =
                "";

        }


        /* =========================================
           PERFORM SEARCH
        ========================================= */

        function performSearch() {


            const searchWords =
                normalizeText(
                    searchInput.value
                )
                .split(" ")
                .filter(
                    word =>
                        word !== ""
                );


            /* =========================================
               EMPTY SEARCH
            ========================================= */

            if (
                searchWords.length === 0
            ) {

                restoreOriginalLayout();

                return;

            }


            /* =========================================
               SEARCH MODE
            ========================================= */

            if (featuredSection) {

                featuredSection.style.display =
                    "none";

            }


            if (latestSection) {

                latestSection.style.display =
                    "none";

            }


            /*
             * Clear previous results
             */

            searchResultsGrid.innerHTML =
                "";


            let visibleCount =
                0;


            /* =========================================
               SEARCH EVERY ARTICLE
            ========================================= */

            posts.forEach(
                post => {


                    const category =
                        post.querySelector(
                            ".post-category"
                        );


                    const title =
                        post.querySelector("h3");


                    const desc =
                        post.querySelector("p");


                    /*
                     * Get original text
                     */

                    const originalCategory =
                        category?.dataset.original ||
                        "";


                    const originalTitle =
                        title?.dataset.original ||
                        "";


                    const originalDesc =
                        desc?.dataset.original ||
                        "";


                    /*
                     * Combine searchable content
                     *
                     * Category
                     * Title
                     * Description
                     */

                    const combinedText =
                        normalizeText(

                            originalCategory +
                            " " +
                            originalTitle +
                            " " +
                            originalDesc

                        );


                    /*
                     * Every search word
                     * must match.
                     */

                    const isMatch =
                        searchWords.every(
                            word =>
                                fuzzyMatch(
                                    combinedText,
                                    word
                                )
                        );


                    /* =========================================
                       MATCH FOUND
                    ========================================= */

                    if (isMatch) {


                        visibleCount++;


                        /*
                         * Highlight category
                         */

                        if (category) {

                            category.innerHTML =
                                highlightText(
                                    originalCategory,
                                    searchWords
                                );

                        }


                        /*
                         * Highlight title
                         */

                        if (title) {

                            title.innerHTML =
                                highlightText(
                                    originalTitle,
                                    searchWords
                                );

                        }


                        /*
                         * Highlight description
                         */

                        if (desc) {

                            desc.innerHTML =
                                highlightText(
                                    originalDesc,
                                    searchWords
                                );

                        }


                        /*
                         * Show card
                         */

                        post.style.display =
                            "";


                        /*
                         * Move the ACTUAL
                         * article card into
                         * the search grid.
                         */

                        searchResultsGrid.appendChild(
                            post
                        );

                    }

                }
            );


            /* =========================================
               SHOW SEARCH RESULTS GRID
            ========================================= */

            searchResultsGrid.style.display =
                "grid";


            /* =========================================
               NO RESULTS
            ========================================= */

            if (
                visibleCount === 0
            ) {


                searchResultsGrid.style.display =
                    "none";


                noResults.innerHTML = `
                    <strong>
                        No matching articles found.
                    </strong>
                `;


                noResults.style.display =
                    "block";


                return;

            }


            /* =========================================
               RESULTS FOUND
            ========================================= */

            noResults.innerHTML = `
                <strong>
                    ${visibleCount}
                    matching
                    ${visibleCount === 1
                        ? "article"
                        : "articles"}
                    found.
                </strong>
            `;


            noResults.style.display =
                "block";

        }


        /* =========================================
           SEARCH INPUT
        ========================================= */

        searchInput.addEventListener(
            "input",
            performSearch
        );


        /* =========================================
           ESCAPE KEY
        ========================================= */

        searchInput.addEventListener(
            "keydown",
            function (event) {


                if (
                    event.key === "Escape" &&
                    this.value !== ""
                ) {


                    this.value =
                        "";


                    restoreOriginalLayout();


                    this.focus();

                }

            }
        );


    }

);


// BACK TO TOP.
const backToTop =
    document.getElementById(
        "backToTop"
    );


/*
 * Show button after scrolling 600px
 */

window.onscroll =
    function () {


        if (
            document.body.scrollTop > 600 ||
            document.documentElement.scrollTop > 600
        ) {

            backToTop.style.display =
                "block";

        } else {

            backToTop.style.display =
                "none";

        }

    };


/*
 * Scroll smoothly to top
 */

backToTop.addEventListener(
    "click",
    () => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }
);

