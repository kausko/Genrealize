import { Avatar, CardHeader } from "@material-ui/core"
import { Skeleton } from "@material-ui/lab"

/**
 * @typedef {import("@material-ui/core").CardHeaderProps} CardHeaderProps
 * @param {{ loading: boolean } & CardHeaderProps} props
 */
export const LoadableCardHeader = ({loading, ...cardHeaderProps}) => {
  let mutatedProps = {...cardHeaderProps}
  const { avatar, action, title, subheader } = mutatedProps
  if (loading) {
    if (!!avatar)
      mutatedProps.avatar = <Skeleton variant="circle"><Avatar /></Skeleton>
    if (!!action)
      mutatedProps.action = <Skeleton>{action}</Skeleton>
    if (!!title)
      mutatedProps.title = <Skeleton width="80%" height={10} variant="text" style={{ marginBottom: 6 }}/>
    if (!!subheader)
      mutatedProps.subheader = <Skeleton width="40%" height={10} variant="text"/>
  }
  return(
    <CardHeader {...mutatedProps}/>
  )
}