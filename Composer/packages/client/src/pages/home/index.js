/** @jsx jsx */
import { jsx } from '@emotion/core';
import { IconButton } from 'office-ui-fabric-react/lib/Button';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { useContext, useEffect, useMemo, useState } from 'react';
import formatMessage from 'format-message';
import { navigate } from '@reach/router';

import { Store } from '../../store/index';
import { CreationFlowStatus } from '../../constants';

import { ToolBar } from './../../components/ToolBar/index';
import * as home from './styles';
const linksLeft = [
  {
    to: 'https://github.com/microsoft/botframework-designer#get-started',
    text: formatMessage('Getting Started'),
    css: home.linkInfo,
  },
  {
    to: 'https://aka.ms/BotframeworkComposerGettingstarted',
    text: formatMessage('Build your first bot'),
    css: home.linkInfo,
  },
];

const linksRight = [
  {
    to: '/home',
    text: formatMessage('Coming soon!'),
    css: home.linkInfo,
  },
];

export const Home = () => {
  const { state, actions } = useContext(Store);
  const { openBotProject, setCreationFlowStatus, fetchTemplates, saveTemplateId, fetchRecentProjects } = actions;
  const botNumLimit = 4;
  const [templates, setTemplates] = useState([]);
  const onClickRecentBotProject = async path => {
    await openBotProject(path);
    navigate('/');
  };

  const onClickNewBotProject = async () => {
    setCreationFlowStatus(CreationFlowStatus.NEW_FROM_SCRATCH);
  };

  const onClickTemplate = async id => {
    saveTemplateId(id);
    setCreationFlowStatus(CreationFlowStatus.NEW_FROM_TEMPLATE);
  };
  const fetchTemplatesAction = async () => {
    const data = await fetchTemplates();
    setTemplates(data);
  };

  const toolbarItems = [
    {
      type: 'action',
      text: formatMessage('New'),
      buttonProps: {
        iconProps: {
          iconName: 'Add',
        },
        onClick: () => setCreationFlowStatus(CreationFlowStatus.NEW),
      },
      align: 'left',
      dataTestid: 'homePage-ToolBar-New',
    },
    {
      type: 'action',
      text: formatMessage('Open'),
      buttonProps: {
        iconProps: {
          iconName: 'OpenFolderHorizontal',
        },
        onClick: () => setCreationFlowStatus(CreationFlowStatus.OPEN),
      },
      align: 'left',
      dataTestid: 'homePage-ToolBar-Open',
    },
  ];

  useEffect(() => {
    fetchRecentProjects();
    fetchTemplatesAction();
  }, []);

  const bots = useMemo(() => {
    const recentProjects = state.recentProjects || [];
    const _bots = recentProjects.map(rp => {
      const pathTokens = rp.path.split('/');
      return {
        iconName: 'Robot',
        actionName: pathTokens[pathTokens.length - 1],
        path: rp.path,
        storageId: rp.storageId,
      };
    });
    return _bots;
  }, [state.recentProjects]);

  return (
    <div css={home.outline}>
      <ToolBar toolbarItems={toolbarItems} />
      <div css={home.page}>
        <div css={home.title}>{formatMessage(`Bot Framework Composer`)}</div>
        <div css={home.introduction}>
          <div css={home.introTitle}>
            <div css={home.introTitleLeft}> {formatMessage(`Creating real conversations for real people.`)} </div>
            <div css={home.linkLeft}>
              {linksLeft.map(link => {
                return (
                  <Link href={link.to} tabIndex={-1} key={'homePageLeftLinks-' + link.text} target={'_blank'}>
                    <div css={link.css}>{link.text}</div>
                  </Link>
                );
              })}
            </div>
          </div>
          <div css={home.introTitle}>
            <div css={home.introTitleRight}> {formatMessage(`Videos`)} </div>
            <div css={home.linkRight}>
              {linksRight.map(link => {
                return (
                  <Link href={link.to} tabIndex={-1} key={'homePageRightLinks-' + link.text} target={'_blank'}>
                    <div css={link.css}>{link.text}</div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        <div css={home.botArea}>
          <div css={home.botTitle}>{formatMessage(`Start from scratch, or pick up where you left off...`)} </div>
          <div css={home.botContainer}>
            <div css={home.botContent}>
              <div
                css={home.action}
                data-testid={'homePage-body-New'}
                onClick={() => {
                  onClickNewBotProject();
                }}
              >
                <IconButton styles={home.button()} iconProps={{ iconName: 'Add' }} />
              </div>
              <div css={home.actionName}> {formatMessage('New')} </div>
            </div>
            {bots.map((bot, index) => {
              if (index >= botNumLimit) return null;
              return (
                <div css={home.botContent} key={'homePageBot-' + bot.path}>
                  <div
                    css={home.action}
                    onClick={() => {
                      onClickRecentBotProject(bot.path);
                    }}
                  >
                    <IconButton styles={home.button()} iconProps={{ iconName: bot.iconName }} />
                  </div>
                  <div css={home.actionName}> {bot.actionName} </div>
                </div>
              );
            })}
          </div>
        </div>
        <div css={home.templateArea}>
          <div css={home.templateTitle}>{formatMessage(`Or start with a conversation template`)} </div>
          <div css={home.templateContainer}>
            {templates.map(template => {
              return (
                <div
                  css={home.templateContent}
                  key={'homePageTemplate-' + template.id}
                  onClick={() => {
                    onClickTemplate(template.id);
                  }}
                >
                  <div css={home.templateText}>{template.name}</div>
                  <div css={home.templateDescription}>{template.description}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div css={home.footerContainer}>
          <Link css={home.footer} href="/home" target={'_blank'}>
            {formatMessage(`Learn More`)}
          </Link>
        </div>
      </div>
    </div>
  );
};