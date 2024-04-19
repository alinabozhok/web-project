export function getData(number) {
    let data = [];

    data[0] = [
        ["Соперник",    "Играем",       "Лидеры",       "Дождь",    "Победа"    ],
        ["Выше",        "Дома",         "На месте",     "Да",       "Нет"       ],
        ["Выше",        "Дома",         "На месте",     "Нет",      "Да"        ],
        ["Выше",        "Дома",         "Пропускают",   "Нет",      "Нет"       ],
        ["Ниже",        "Дома",         "Пропускают",   "Нет",      "Да"        ],
        ["Ниже",        "В гостях",     "Пропускают",   "Нет",      "Нет"       ],
        ["Ниже",        "Дома",         "Пропускают",   "Да",       "Да"        ],
        ["Выше",        "В гостях",     "На месте",     "Да",       "Нет"       ],
        ["Ниже",        "В гостях",     "На месте",     "Нет",      "Да"        ]
    ];
    data[1] =  [
        ["Toothed", "Hair", "Breathes", "Legs", "species"],
        ["Toothed", "Hair", "Breathes", "Legs", "Mammal"],
        ["Toothed", "Hair", "Breathes", "Legs", "Mammal"],
        ["Toothed", "Not Hair", "Breathes", "Not Legs", "Reptile"],
        ["Not Toothed", "Hair", "Breathes", "Legs", "Mammal"],
        ["Toothed", "Hair", "Breathes", "Legs", "Mammal"],
        ["Toothed", "Hair", "Breathes", "Legs", "Mammal"],
        ["Toothed", "Not Hair", "Not Breathes", "Not Legs", "Reptile"],
        ["Toothed", "Not Hair", "Breathes", "Not Legs", "Reptile"],
        ["Toothed", "Not Hair", "Breathes", "Legs", "Mammal"],
        ["Not Toothed", "Not Hair", "Breathes", "Legs", "Reptile"]

    ];

    return data[number]
}