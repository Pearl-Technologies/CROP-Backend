const mongoose = require("mongoose");
const businessServices = mongoose.model("Business_Services",
  {
    pickup: { type: Boolean, default: true },
    delivery: { type: Boolean, default: false },
    workingDayAndHours: {
      sunday: {
        working: {type: Boolean},
        operatingHours: {
          from: String,
          to: String,
        },
      },
      monday: {
        working: {type: Boolean},
        operatingHours: {
          from: String,
          to: String,
        },
      },
      tuesday: {
        working: {type: Boolean},
        operatingHours: {
          from: String,
          to: String,
        },
      },
      wednesday: {
        working: {type: Boolean},
        operatingHours: {
          from: String,
          to: String,
        },
      },
      thursday: {
        working: {type: Boolean},
        operatingHours: {
          from: String,
          to: String,
        },
      },
      friday: {
        working: {type: Boolean},
        operatingHours: {
          from: String,
          to: String,
        },
      },
      saturday: {
        working: {type: Boolean},
        operatingHours: {
          from: String,
          to: String,
        },
      },
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "business",
      unique: true
    },
  },
  
);

module.exports = businessServices;
