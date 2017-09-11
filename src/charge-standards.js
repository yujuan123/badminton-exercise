function chargeStandards() {
  return [
    {
      weekDays:[
        {
          date:"09:00~12:00",
          price:30
        },
        {
          date:"12:00~18:00",
          price:50
        },
        {
          date:"18:00~20:00",
          price:80
        },
        {
          date:"20:00~22:00",
          price:60
        }
      ]
    },
    {
      weekends:[
        {
          date:"09:00~12:00",
          price:40
        },
        {
          date:"12:00~18:00",
          price:50
        },
        {
          date:"18:00~22:00",
          price:60
        }
      ]
    }
  ]
}

module.exports = chargeStandards;
