port module Main exposing (..)

import Html exposing (Html, table, span, text, div, h1, img, ol, ul, li, tr, td)
import Html.Attributes exposing (class, src)
import Html.Events exposing (onClick)
import Task
import Time exposing (Time)
import Process
import Debug
import String

port clipboardEvents : (ClipboardEvents -> msg) -> Sub msg
port clipboardEvent : (ClipboardEvent -> msg) -> Sub msg
port setPaste : String -> Cmd msg

type alias ClipboardEvents =
  List ClipboardEvent

type alias ClipboardEvent =
  {
    string: String
  }

type alias Model =
  {
    history: List ClipboardEvent,
    animatingOnSelect: String
  }

init : (Model, Cmd Msg)
init =
  (Model [] "", Cmd.none)

delay : Time -> msg -> Cmd msg
delay time msg =
  Process.sleep time
  |> Task.andThen (always <| Task.succeed msg)
  |> Task.perform identity

type Msg
  = ClipboardEventMsg ClipboardEvent
  | ClipboardEventsMsg ClipboardEvents
  | ClipboardContentSelected String
  | SetSelectedMsg String

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    ClipboardEventMsg evt ->
      ( { model | history = List.append model.history [evt] }, Cmd.none )
    ClipboardEventsMsg evts ->
      ( { model | history = evts }, Cmd.none )
    ClipboardContentSelected msg ->
      let
        (newModel, cmds) = update (SetSelectedMsg msg) model
      in
        (newModel,setPaste msg)
    SetSelectedMsg msg ->
      let
        voidMsg = SetSelectedMsg ""
      in
        (
          { model | animatingOnSelect = msg },
          Cmd.batch [
            delay 1 voidMsg
          ]
        )


renderHistoricClip : Model -> List (Html Msg)
renderHistoricClip model =
  let row clip =
    div [ class "clip-row", onClick (ClipboardContentSelected clip.string) ] [
      span [ Html.Attributes.classList [ ("clip-item", True), ("clip-item-onselect", model.animatingOnSelect == clip.string) ] ] [
        span [ class "clip-item-icon clip-item-icon-copy typcn typcn-tabs-outline" ] [],
        span [ class "clip-item-content" ] [ text clip.string ],
        span [ class "clip-item-icon clip-item-icon-arrow clip-item-icon-arrow-up typcn typcn-arrow-up-outline" ] [],
        span [ class "clip-item-icon clip-item-icon-arrow clip-item-icon-arrow-down typcn typcn-arrow-down-outline" ] [],
        span [ class "clip-item-icon clip-item-icon-bookmark typcn typcn-bookmark" ] [],
        span [ class "clip-item-icon clip-item-icon-delete typcn typcn-times-outline clip-item-last" ] []
      ]
    ]
  in
    List.map row model.history

view : Model -> Html Msg
view model =
  div [ class "root" ]
    [
      div [ class "nav" ] [
        div [ class "button-container" ] [
          div [ class "icon typcn typcn-attachment-outline" ] [ ]
        ],
        div [ class "button-container" ] [
          div [ class "icon typcn typcn-bookmark" ] [ ]
        ],
        div [ class "button-container" ] [
          div [ class "icon typcn typcn-cog-outline" ] [ ]
        ]
      ],
      div [ class "content"] [
        div [ class "clip-table" ] (List.reverse (renderHistoricClip model)),
        (
          if List.length model.history == 0 then
            div [ class "no-clips"] [ text "No content copied, yet!" ]
          else
            div [] []
        )
      ]
    ]


subscriptions : Model -> Sub Msg
subscriptions model =
  Sub.batch [
    clipboardEvent ClipboardEventMsg,
    clipboardEvents ClipboardEventsMsg
  ]

main : Program Never Model Msg
main =
  Html.program
    { view = view
    , init = init
    , update = update
    , subscriptions = subscriptions
    }
