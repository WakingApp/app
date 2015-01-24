package wakingapp.pages

import org.scalajs.dom
import wakingapp.helpers.{Format, CustomPage}

import org.widok._
import org.widok.html._
import org.widok.bindings.Bootstrap._

import scala.scalajs.js
import scala.scalajs.js.{JSON, Date}

case class Calendar() extends CustomPage {
  val alarmTime = Var[String]("")

  val socket = js.Dynamic.global.io("http://10.100.93.15")

  val currentTime = Channel[Date]()
  val times = Buffer(0, 30, 60, 90, 120, 150)
  val timeRange = Var[Option[Ref[Int]]](Some(times.get.head))

  val ignAlarmTime = alarmTime.tail
  ignAlarmTime.foreach(_ => sendSettings())
  val ignTimeRange = timeRange.tail
  timeRange.foreach(_ => sendSettings())

  socket.on("settings", (json: js.Dynamic) => {
    alarmTime.produce(json.alarmTime.toString, ignAlarmTime)
    timeRange.produce(times.get.find(_.get == json.timeRange.toString.toInt), ignTimeRange)
  })

  def sendSettings() {
    socket.emit("settings", js.Dynamic.literal(
      alarmTime = alarmTime.get,
      timeRange = timeRange.get.get.get
    ))
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

  , Grid.Row(
      div(
        h1(currentTime.map(Format.time))
      ).css("col-md-2 col-md-offset-5")
    )
  )

  dom.setInterval(() => currentTime := new Date(), 1000)

  def ready(route: InstantiatedRoute) { }
}
