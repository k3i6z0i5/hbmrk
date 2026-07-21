/**
 * HBMR Journal Manuscripts Database (Static JSON)
 * 
 * To publish a new issue or add approved manuscripts:
 * 1. Put the PDF file in the `public/manuscripts/` directory (e.g., `public/manuscripts/v1i1/article1.pdf`).
 * 2. Add the article object to the `articles` array of the appropriate issue.
 * 3. If an issue is ready to be published, set `isPublished: true`.
 *    - The latest published issue will automatically show on the "Current Issue" page.
 *    - Older published issues will automatically appear in the "Archives" list.
 *    - If no issues are published yet (`isPublished: false`), the site shows the "Coming Soon" page.
 */

export const manuscriptsDb = [
  {
    volume: 1,
    issue: 1,
    year: 2025,
    isPublished: false, // Set to true when you want to make it public
    publishDate: "Pending", // e.g., "September 2025"
    articles: [
      /* Example Article Template (uncomment and edit to add your first article):
      {
        id: "hbmr-v1i1-a1",
        title: "Impact of Artificial Intelligence on Supply Chain Optimization in Retail Sector",
        authors: [
          { name: "Dr. Rajesh Kumar", affiliation: "Department of Management Studies, Hallmark Business School" },
          { name: "Prof. Sarah Miller", affiliation: "London Business School, UK" }
        ],
        abstract: "This study explores the integration of artificial intelligence (AI) and machine learning algorithms in optimizing retail supply chains. Through empirical research and case analysis, we demonstrate how predictive analytics improves inventory replenishment efficiency, reduces logistics overheads, and enhances customer satisfaction. The findings offer practical insights for retail supply chain paradigms.",
        keywords: ["Artificial Intelligence", "Supply Chain Management", "Retail Analytics", "Machine Learning"],
        pages: "1 - 15",
        doi: "10.5281/hbmr.2025.1101",
        pdfUrl: "/manuscripts/v1i1/article1.pdf"
      }
      */
    ]
  }
]
