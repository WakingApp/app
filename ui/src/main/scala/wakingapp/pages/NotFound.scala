package wakingapp.pages

import org.widok._

import wakingapp.helpers.CustomPage

case class NotFound() extends CustomPage {
  def body() = "Page not found."
  def ready(route: InstantiatedRoute) { }
}
