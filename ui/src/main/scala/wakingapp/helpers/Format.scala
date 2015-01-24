package wakingapp.helpers

import scala.scalajs.js.Date

object Format {
  def padWithLeadingZero(value: Int) = {
    val v = value.toString
    if (v.length == 1) s"0$v"
    else v
  }

  def time(date: Date): String =
    padWithLeadingZero(date.getHours()) + ":" +
      padWithLeadingZero(date.getMinutes()) + ":" +
      padWithLeadingZero(date.getSeconds())

  def minutes(min: Int): String = {
    val hrs = min / 60
    val fract = if (min - hrs * 60 == 30) "½" else ""
    val hrsText =
      if (hrs == 0) s"$min minutes"
      else if (hrs == 1) s"$hrs $fract hour"
      else s"$hrs $fract hours"

    "+-" + hrsText
  }
}
