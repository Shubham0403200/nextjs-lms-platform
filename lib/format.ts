export const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "INR",
    }).format(price)
}