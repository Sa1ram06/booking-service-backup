const Booking = require("../models/booking");
const Session = require("../models/session");

const createBooking = async (req, res) => {
    try {
        const { sessionId, clientId } = req.body;

        // Check if booking already exists
        const bookingExist = await Booking.getBookingBySessionAndClientIds(sessionId, clientId);

        if (bookingExist !== null) {
            if (bookingExist.BookingStatus === "Cancelled") {
                const reconfirmBooking = await Booking.reconfirmBookingStatusByBookingId(bookingExist.BookingId);

                if (reconfirmBooking) {
                    res.status(405).json({
                        message: `Failed to create booking, booking already exists.`,
                    });
                    return;
                }
            } else {
                res.status(405).json({
                    message: `Failed to create booking, booking has already been completed.`,
                });
                return;
            }
        }

        // Create a new booking
        const createBooking = await Booking.createBooking(sessionId, clientId);

        if (!createBooking) {
            res.status(500).json({
                message: `Failed to create booking.`,
            });
            return;
        }

        res.status(201).json({
            message: `Booking with ID ${createBooking.bookingId} has been created successfully`,
            booking: createBooking,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error - Scold Emmanuel",
            error: err,
        });
    }
}

const cancelBookingByBookingId = async (req, res) => {
    try {
        const { bookingId } = req.params;

        // Cancel the booking
        const cancelBooking = await Booking.cancelBookingByBookingId(bookingId);

        if (!cancelBooking) {
            res.status(405).json({
                message: `Failed to cancel booking, invalid bookingId.`,
            });
            return;
        }

        res.status(200).json({
            message: `Booking with ID ${bookingId} has been cancelled successfully`,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error - Scold Emmanuel",
            error: err,
        });
    }
}

const viewBookingsByClientId = async (req, res) => {
    try {
        const { clientId } = req.params;

        // Get client's bookings
        const viewBookings = await Booking.viewBookingsByClientId(clientId);

        if (!viewBookings) {
            res.status(500).json({
                message: `Failed to get client's bookings.`,
            });
            return;
        } else if (viewBookings.length === 0) {
            res.status(404).json({
                message: `Client has no bookings or does not exist.`,
            });
            return;
        }

        res.status(200).json({
            message: `Bookings of client retrieved successfully`,
            bookings: viewBookings,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: "Error",
            message: "Internal Server Error - Scold Emmanuel",
            error: err,
        });
    }
}

module.exports = {
    createBooking,
    cancelBookingByBookingId,
    viewBookingsByClientId,
}
