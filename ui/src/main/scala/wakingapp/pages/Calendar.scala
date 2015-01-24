package wakingapp.pages

import org.scalajs.dom
import wakingapp.helpers.{Format, CustomPage}

import org.widok._
import org.widok.html._
import org.widok.bindings.Bootstrap._

import scala.scalajs.js.Date

case class Calendar() extends CustomPage {
  val ws = new dom.WebSocket("ws://10.100.93.15:3000")
  ws.onmessage = (x: dom.MessageEvent) => gotMessage(x.data.toString)
  ws.onopen = (x: dom.Event) => {}
  ws.onerror = (x: dom.ErrorEvent) => Console.println("some error has occured " + x.message)
  ws.onclose = (x: dom.CloseEvent) => {}

  def gotMessage(s: String) {
    println(s)
  }

  val currentTime = Channel[Date]()
  val times = Buffer(0, 30, 60, 90, 120, 150)
  val selection = Channel[Option[Ref[Int]]]()
  selection.foreach(x => println(x))

  def body() = Inline(
    Grid.Row(
      Grid.Column(Grid.ColumnType.Medium, 2)(
        "Time window:"
      )

    , Grid.Column(Grid.ColumnType.Medium, 3)(
        Input.Text().placeholder("hh:mm")
      )

    , Grid.Column(Grid.ColumnType.Medium, 3)(
        Input.Text().placeholder("hh:mm")
      )

    , Grid.Column(Grid.ColumnType.Medium, 3)(
        Input.Select(Seq.empty)
          .bind(times.mapTo(Format.minutes), selection)
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
