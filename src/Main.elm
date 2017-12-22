port module Main exposing (..)

import Html exposing (Html, table, span, text, div, h1, img, ol, ul, li, tr, td)
import Html.Attributes exposing (class, src)
import Html.Events exposing (onClick)

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
    history: List ClipboardEvent
  }

init : (Model, Cmd Msg)
init =
  (Model [], Cmd.none)

type Msg
  = ClipboardEventMsg ClipboardEvent
  | ClipboardEventsMsg ClipboardEvents
  | SetPasteMsg String


update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    ClipboardEventMsg evt ->
      ( Model (List.append model.history [evt] ), Cmd.none )
    ClipboardEventsMsg evts ->
      ( Model evts, Cmd.none )
    SetPasteMsg msg ->
      ( model, setPaste msg)


renderHistoricClip : ClipboardEvent -> Html Msg
renderHistoricClip clip =
  tr [ onClick (SetPasteMsg clip.string) ] [
    td [ class "clip-row" ] [
      span [ class "clip-item" ] [ text clip.string ]
    ]
  ]

view : Model -> Html Msg
view model =
  div [ class "root" ]
    [
      div [ class "nav" ] [
        div [ class "button-container" ] [
          div [ class "icon typcn typcn-attachment-outline" ] [ ]
        ],
        div [ class "button-container" ] [
          div [ class "icon typcn typcn-arrow-left" ] [ ]
        ]
      ],
      div [ class "content"] [
        table [ class "clip-table" ] (List.map renderHistoricClip model.history)
      ],
      div [ class "right-gutter" ] []
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
