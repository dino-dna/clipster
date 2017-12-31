
view : Model -> Html Msg
view model =
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
