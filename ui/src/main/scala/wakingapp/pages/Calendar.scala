package wakingapp.pages

import org.scalajs.dom
import wakingapp.helpers.{Format, CustomPage}

import org.widok._
import org.widok.html._
import org.widok.bindings.Bootstrap._

import scala.scalajs.js
import scala.scalajs.js.Date

case class Calendar() extends CustomPage {
  type IsCritical = Boolean

  // TODO Add buttons to 'fake' actions

  val alarmTime = Var[String]("")
  val alarmTriggered = Var[Option[IsCritical]](None)

  val events = Buffer[String]()

  val socket = js.Dynamic.global.io("http://10.100.85.125")

  val currentTime = Channel[Date]()
  val times = Buffer(0, 30, 60, 90, 120, 150)
  val timeRange = Var[Option[Ref[Int]]](Some(times.get.head))
  val actualAlarmTime = Opt[String]()

  val ignAlarmTime = alarmTime.tail
  ignAlarmTime.tail.foreach(at => { // TODO .tail is a workaround
    println("Alarm time: " + alarmTime.get)
    actualAlarmTime := at
  })
  val ignTimeRange = timeRange.tail
  ignTimeRange.tail.foreach(tr => {
    println(s"Time range: $tr")
  })

  socket.on("settings", (json: js.Dynamic) => {
    alarmTime.produce(json.alarmTime.toString, ignAlarmTime)
    timeRange.produce(times.get.find(_.get == json.timeRange.toString.toInt), ignTimeRange)
  })

  socket.on("alarm", (crit: js.Dynamic) => {
    alarmTriggered := Some(crit.toString.toBoolean)
  })

  socket.on("actualAlarmTime", (time: js.Dynamic) => {
    // TODO between X and Y
    actualAlarmTime := time.toString
  })

  socket.on("showerOccupied", (json: js.Dynamic) => {
    events += "The shower is occupied"
  })

  socket.on("showerFree", (json: js.Dynamic) => {
    events += "The shower is free"
  })

  def sendSettings() {
    socket.emit("settings", js.Dynamic.literal(
      alarmTime = alarmTime.get,
      timeRange = timeRange.get.get.get
    ))
  }

  def snooze(minutes: Int) {
    alarmTriggered := None
    socket.emit("snooze", minutes)
  }

  def body() = Inline(
    Grid.Row(
      Grid.Column(Grid.ColumnType.Medium, 2)(
        "Time window:"
      )

    , Grid.Column(Grid.ColumnType.Medium, 3)(
        Input.Text().placeholder("hh:mm")
          .bindLive(alarmTime)
      )

    , Grid.Column(Grid.ColumnType.Medium, 3)(
        Input.Select(Seq.empty)
          .bind(times.mapTo(Format.minutes), timeRange)
      )
    )

    , Grid.Column(Grid.ColumnType.Medium, 3)(
        Button()("Set alarm").onClick(_ => sendSettings())
      )

  , Grid.Row(
      div(
        h1("Current time: " , currentTime.map(Format.time))
      , h1("Actual alarm time: " , actualAlarmTime)
      ).css("col-md-4 col-md-offset-5")
    )

    , p(b("Events"))
    , p(
      div("No events triggered")
        .css("alert alert-danger")
        .show(events.isEmpty)

    , ul().bind(events) { case Ref(ev) =>
        li(ev)
      }
    )

  , Grid.Row(
      div(
        div(
          h1("Alarm triggered")
        ).css("alert")
         .cssCh(alarmTriggered.map(alarm => if (alarm == Some(true)) "alert-danger" else "alert-success"))
      , Button(Button.Size.Large)("Snooze 5 minutes").onClick(_ => snooze(5))
      , Button(Button.Size.Large)("Snooze 15 minutes").onClick(_ => snooze(15))
      ).css("col-md-2 col-md-offset-5")
       .show(alarmTriggered.map(_.nonEmpty))
    )
  )

  dom.setInterval(() => currentTime := new Date(), 1000)

  def ready(route: InstantiatedRoute) { }
}
