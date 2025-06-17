export interface InvoiceResponse {
    status: boolean;
    message: string;
    data: InvoiceData;
}

export interface InvoiceData {
    invoice_details: InvoiceDetail[];
}

export interface InvoiceDetail {
    _id: string;
    invoice_id: string;
    invoice_date: string;
    due_date: string;
    total_amount: number;
    amount_due: number;
    sub_total: number | null;
    igst: number | null;
    vat: number | null;
    sgst: number | null;
    cgst: number | null;
    gst: number | null;
    tax: number | null;
    currency: string;
    vendor_name: string;
    vendor_email: string;
    vendor_address: string;
    vendor_tax_id: string | null;
    customer_name: string;
    customer_email: string | null;
    customer_address: string;
    customer_tax_id: string | null;
    items: any[]; // Replace `any` with a specific type if available
    purchase_order_id: string | null;
    file_id: string;
}
