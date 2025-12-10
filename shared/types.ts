// This interface defines exactly what data makes up a label.
// Both the React form and the Node generator will respect this structure.

export interface CoinLabelData {
    id: string;           // The unique JCG ID (e.g., "JCG-183044176")
    year: string;         // e.g., "1921"
    denomination: string; // e.g., "Morgan Dollar"
    mintMark?: string;    // e.g., "S" (Optional, as not all coins have one)
}